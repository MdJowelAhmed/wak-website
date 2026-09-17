'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/select';
import { myFetch } from '../../helpers/myFetch';
import { getGoogleMapsKey, loadGoogleMaps } from '../../helpers/google-maps';
import {
    hasCoordinates,
    labelFromAddressComponents,
    mapCenterForCountry,
    type DeliveryLocation,
} from '../../helpers/delivery-location';
import {
    addressFromSaveResponse,
    emptyShippingPayload,
    isShippingFormComplete,
    payloadFromAddress,
    shippingAddressLabel,
    toShippingPayload,
    upsertShippingAddress,
    type ShippingAddress,
    type ShippingAddressPayload,
} from '../../helpers/shipping-address';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    countryCode: string;
    currentLocation: DeliveryLocation | null;
    onSelectLocation: (location: DeliveryLocation) => void;
    addresses?: ShippingAddress[];
    onAddressesChange?: (addresses: ShippingAddress[]) => void;
    isLoggedIn?: boolean;
}

interface CountryOption {
    name: string;
    countryCode: string;
}

const fieldClass =
    'h-11 rounded-xl border-white/15 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary';

const nativeSelectClass =
    'h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary';

function hasMapCoords(lat: number, lng: number): boolean {
    return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

function locationFromGeocoderResult(
    result: google.maps.GeocoderResult,
    lat: number,
    lng: number,
): DeliveryLocation & { state?: string; countryCode?: string } {
    const get = (type: string) =>
        result.address_components.find((item) => item.types.includes(type))?.long_name;
    const getShort = (type: string) =>
        result.address_components.find((item) => item.types.includes(type))?.short_name;

    return {
        label: labelFromAddressComponents(result.address_components, result.formatted_address),
        formattedAddress: result.formatted_address,
        lat,
        lng,
        city: get('locality') || get('administrative_area_level_2') || get('administrative_area_level_1'),
        country: get('country'),
        postalCode: get('postal_code'),
        state: get('administrative_area_level_1'),
        countryCode: getShort('country'),
    };
}

function mapCountries(data: unknown): CountryOption[] {
    if (!Array.isArray(data)) return [];
    const countries: CountryOption[] = [];
    for (const item of data) {
        const row = item as { name?: string; countryCode?: string };
        if (!row.name) continue;
        countries.push({ name: row.name, countryCode: row.countryCode || '' });
    }
    return countries;
}

interface PlaceSuggestion {
    placeId: string;
    description: string;
}

function moveMapTo(map: google.maps.Map | null, marker: google.maps.Marker | null, lat: number, lng: number) {
    if (!map || !marker) return;
    const latLng = { lat, lng };
    map.panTo(latLng);
    map.setZoom(16);
    marker.setPosition(latLng);
}

function getPlacePredictions(query: string): Promise<PlaceSuggestion[]> {
    return new Promise((resolve) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: query }, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
                resolve([]);
                return;
            }
            resolve(
                predictions
                    .filter((item) => Boolean(item.place_id))
                    .map((item) => ({
                        placeId: item.place_id as string,
                        description: item.description,
                    })),
            );
        });
    });
}

function getPlaceDetails(
    map: google.maps.Map,
    placeId: string,
): Promise<google.maps.places.PlaceResult | null> {
    return new Promise((resolve) => {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId,
                fields: ['geometry', 'formatted_address', 'address_components', 'name'],
            },
            (place, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
                    resolve(null);
                    return;
                }
                resolve(place);
            },
        );
    });
}

function locationFromAddress(address: ShippingAddress): DeliveryLocation {
    return {
        label: shippingAddressLabel(address),
        formattedAddress: address.address,
        lat: address.latitude,
        lng: address.longitude,
        city: address.city,
        country: address.country,
        postalCode: address.postalCode,
    };
}

export default function LocationModal({
    isOpen,
    onClose,
    countryCode,
    currentLocation,
    onSelectLocation,
    addresses = [],
    onAddressesChange,
    isLoggedIn = false,
}: LocationModalProps) {
    const t = useTranslations('LocationModal');
    const checkoutT = useTranslations('Checkout');
    const searchRef = useRef<HTMLInputElement>(null);
    const mapNodeRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [draft, setDraft] = useState<DeliveryLocation | null>(currentLocation);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'detecting' | 'saving'>('idle');
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState('new');
    const [form, setForm] = useState<ShippingAddressPayload>(emptyShippingPayload(true));
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [coordsConfirmed, setCoordsConfirmed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [searching, setSearching] = useState(false);
    const countriesRef = useRef<CountryOption[]>([]);
    const searchTimerRef = useRef<number>(0);
    countriesRef.current = countries;

    const applyGeocode = (location: DeliveryLocation & { state?: string; countryCode?: string }) => {
        setDraft(location);
        setCoordsConfirmed(hasMapCoords(location.lat, location.lng));
        setForm((prev) => {
            const matched = countriesRef.current.find(
                (country) =>
                    country.name === location.country ||
                    country.countryCode === location.countryCode,
            );
            return {
                ...prev,
                address: location.formattedAddress || prev.address,
                city: location.city || prev.city,
                state: location.state || prev.state,
                country: matched?.name || location.country || prev.country,
                countryCode: matched?.countryCode || location.countryCode || prev.countryCode,
                postalCode: location.postalCode || prev.postalCode,
                latitude: location.lat,
                longitude: location.lng,
            };
        });
    };
    const applyGeocodeRef = useRef(applyGeocode);
    applyGeocodeRef.current = applyGeocode;

    useEffect(() => {
        if (!isOpen) return;
        setDraft(currentLocation);
        const current = addresses.find((address) => address.isDefault) || addresses[0] || null;
        if (current) {
            setSelectedId(current._id);
            setForm(payloadFromAddress(current));
            setCoordsConfirmed(hasMapCoords(current.latitude, current.longitude));
        } else {
            setSelectedId('new');
            setForm(emptyShippingPayload(true));
            setCoordsConfirmed(false);
        }
        setSearchQuery('');
        setSuggestions([]);
        // Initialize once per open so typing is not reset by parent re-renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !isLoggedIn) return;
        let cancelled = false;
        myFetch('/meta/countries', {
            cache: 'force-cache',
            next: { revalidate: 86400, tags: ['countries'] },
        }).then((res) => {
            if (!cancelled) setCountries(mapCountries(res?.data));
        });
        return () => {
            cancelled = true;
        };
    }, [isOpen, isLoggedIn]);

    useEffect(() => {
        return () => window.clearTimeout(searchTimerRef.current);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;
        const listeners: google.maps.MapsEventListener[] = [];

        const applyLatLng = async (latLng: google.maps.LatLng) => {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: latLng });
            const result = response.results[0];
            if (!result || cancelled) return;
            applyGeocodeRef.current(locationFromGeocoderResult(result, latLng.lat(), latLng.lng()));
        };

        const timer = window.setTimeout(async () => {
            if (!getGoogleMapsKey()) {
                setStatus('error');
                setError(t('missingKey'));
                return;
            }

            setStatus('loading');
            setError('');

            try {
                await loadGoogleMaps();
                if (cancelled || !mapNodeRef.current) return;

                const fallback = mapCenterForCountry(countryCode);
                const selectedCoords =
                    Number.isFinite(form.latitude) &&
                    Number.isFinite(form.longitude) &&
                    !(form.latitude === 0 && form.longitude === 0)
                        ? { lat: form.latitude, lng: form.longitude }
                        : null;
                const saved = hasCoordinates(currentLocation) ? currentLocation : null;
                const center = selectedCoords || (saved
                    ? { lat: saved.lat, lng: saved.lng }
                    : { lat: fallback.lat, lng: fallback.lng });

                const map = new google.maps.Map(mapNodeRef.current, {
                    center,
                    zoom: selectedCoords || saved ? 15 : fallback.zoom,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                });
                const marker = new google.maps.Marker({
                    map,
                    position: center,
                    draggable: true,
                });

                listeners.push(
                    map.addListener('click', (event: google.maps.MapMouseEvent) => {
                        if (!event.latLng) return;
                        marker.setPosition(event.latLng);
                        void applyLatLng(event.latLng);
                    }),
                );
                listeners.push(
                    marker.addListener('dragend', () => {
                        const position = marker.getPosition();
                        if (position) void applyLatLng(position);
                    }),
                );

                mapRef.current = map;
                markerRef.current = marker;
                setStatus('idle');
            } catch {
                if (!cancelled) {
                    setStatus('error');
                    setError(t('loadError'));
                }
            }
        }, 80);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            listeners.forEach((listener) => listener.remove());
            mapRef.current = null;
            markerRef.current = null;
        };
        // Map mounts when the dialog opens; address switches pan via a separate effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, countryCode, t]);

    const panTo = (lat: number, lng: number) => {
        if (!mapRef.current || !markerRef.current) return;
        if (!lat && !lng) return;
        const latLng = { lat, lng };
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(15);
        markerRef.current.setPosition(latLng);
    };

    const applyPlaceToMap = (
        lat: number,
        lng: number,
        result?: {
            address_components: google.maps.GeocoderAddressComponent[];
            formatted_address: string;
        },
    ) => {
        moveMapTo(mapRef.current, markerRef.current, lat, lng);
        if (result) {
            applyGeocode(locationFromGeocoderResult(result as google.maps.GeocoderResult, lat, lng));
        }
    };

    const searchByText = async (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        setSearching(true);
        setError('');
        try {
            await loadGoogleMaps();
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ address: trimmed });
            const result = response.results[0];
            const location = result?.geometry?.location;
            if (!result || !location) {
                toast.error(t('searchNoResults'));
                return;
            }
            applyPlaceToMap(location.lat(), location.lng(), {
                address_components: result.address_components,
                formatted_address: result.formatted_address,
            });
            setSearchQuery(result.formatted_address);
            setSuggestions([]);
        } catch {
            toast.error(t('searchNoResults'));
        } finally {
            setSearching(false);
        }
    };

    const selectSuggestion = async (suggestion: PlaceSuggestion) => {
        setSearching(true);
        setError('');
        try {
            await loadGoogleMaps();
            const map = mapRef.current;
            if (!map) {
                await searchByText(suggestion.description);
                return;
            }
            const place = await getPlaceDetails(map, suggestion.placeId);
            const location = place?.geometry?.location;
            if (!location) {
                await searchByText(suggestion.description);
                return;
            }
            if (place.formatted_address && place.address_components) {
                applyPlaceToMap(location.lat(), location.lng(), {
                    address_components: place.address_components,
                    formatted_address: place.formatted_address,
                });
            } else {
                moveMapTo(mapRef.current, markerRef.current, location.lat(), location.lng());
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({ location });
                const result = response.results[0];
                if (result) {
                    applyGeocode(locationFromGeocoderResult(result, location.lat(), location.lng()));
                }
            }
            setSearchQuery(place.formatted_address || suggestion.description);
            setSuggestions([]);
        } catch {
            await searchByText(suggestion.description);
        } finally {
            setSearching(false);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        window.clearTimeout(searchTimerRef.current);
        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        searchTimerRef.current = window.setTimeout(() => {
            void (async () => {
                try {
                    await loadGoogleMaps();
                    const next = await getPlacePredictions(value.trim());
                    setSuggestions(next);
                } catch {
                    setSuggestions([]);
                }
            })();
        }, 250);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError(t('geoUnsupported'));
            return;
        }

        setStatus('detecting');
        setError('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    await loadGoogleMaps();
                    const latLng = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude,
                    );
                    mapRef.current?.panTo(latLng);
                    mapRef.current?.setZoom(16);
                    markerRef.current?.setPosition(latLng);
                    const geocoder = new google.maps.Geocoder();
                    const response = await geocoder.geocode({ location: latLng });
                    const result = response.results[0];
                    if (result) {
                        applyGeocode(locationFromGeocoderResult(result, latLng.lat(), latLng.lng()));
                    }
                } catch {
                    setError(t('geoDenied'));
                } finally {
                    setStatus('idle');
                }
            },
            () => {
                setStatus('idle');
                setError(t('geoDenied'));
            },
        );
    };

    const handleAddressSelect = (value: string) => {
        setSelectedId(value);
        if (value === 'new') {
            setForm(emptyShippingPayload(addresses.length === 0));
            setCoordsConfirmed(false);
            return;
        }
        const selected = addresses.find((address) => address._id === value);
        if (selected) {
            setForm(payloadFromAddress(selected));
            setCoordsConfirmed(hasMapCoords(selected.latitude, selected.longitude));
            panTo(selected.latitude, selected.longitude);
        }
    };

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        const checked = (event.target as HTMLInputElement).checked;
        setForm((prev) => {
            const next = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
            if (name === 'country') {
                const selectedCountry = countries.find((country) => country.name === value);
                if (selectedCountry) next.countryCode = selectedCountry.countryCode;
            }
            return next;
        });
    };

    const readMapCoords = () => {
        const position = markerRef.current?.getPosition();
        if (position) {
            return { latitude: position.lat(), longitude: position.lng() };
        }
        return { latitude: form.latitude, longitude: form.longitude };
    };

    const saveAddress = async () => {
        const mapCoords = readMapCoords();
        if (!coordsConfirmed || !hasMapCoords(mapCoords.latitude, mapCoords.longitude)) {
            toast.error(t('pickOnMap'));
            return null;
        }

        const payload = toShippingPayload({
            ...form,
            ...mapCoords,
            isDefault: true,
        });
        if (!isShippingFormComplete(payload)) {
            toast.error(checkoutT('requiredFields'));
            return null;
        }

        setStatus('saving');
        try {
            if (selectedId !== 'new') {
                const res = await myFetch(`/shipping-addresses/${selectedId}`, {
                    method: 'PATCH',
                    body: { ...payload, isDefault: true },
                });
                if (!res?.success) {
                    toast.error(res?.message || checkoutT('updateAddressError'));
                    return null;
                }
                return addressFromSaveResponse(res.data, { ...payload, isDefault: true, _id: selectedId });
            }

            const res = await myFetch('/shipping-addresses', {
                method: 'POST',
                body: { ...payload, isDefault: true },
            });
            if (typeof res?.data?._id !== 'string') {
                toast.error(res?.message || checkoutT('saveAddressError'));
                return null;
            }
            return addressFromSaveResponse(res.data, {
                ...payload,
                isDefault: true,
                _id: res.data._id,
            });
        } catch {
            toast.error(checkoutT('saveFailed'));
            return null;
        } finally {
            setStatus('idle');
        }
    };

    const handleApply = async () => {
        if (isLoggedIn) {
            const saved = await saveAddress();
            if (!saved) return;
            onAddressesChange?.(upsertShippingAddress(addresses, saved));
            onSelectLocation(locationFromAddress(saved));
            toast.success(checkoutT('addressSaved'));
            onClose();
            return;
        }

        if (!draft?.label || !coordsConfirmed) return;
        const mapCoordsFromPin = readMapCoords();
        if (!hasMapCoords(mapCoordsFromPin.latitude, mapCoordsFromPin.longitude)) {
            toast.error(t('pickOnMap'));
            return;
        }
        onSelectLocation({
            ...draft,
            lat: mapCoordsFromPin.latitude,
            lng: mapCoordsFromPin.longitude,
        });
        onClose();
    };

    const busy = status === 'detecting' || status === 'loading' || status === 'saving';
    const mapCoords = coordsConfirmed && hasMapCoords(form.latitude, form.longitude);
    const canSubmit = isLoggedIn
        ? !busy && isShippingFormComplete(form) && mapCoords
        : Boolean(draft?.label) && mapCoords;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-secondary p-0 text-white shadow-2xl [&>button]:text-white/80 [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
                onPointerDownOutside={(event) => {
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('.pac-container')) event.preventDefault();
                }}
                onFocusOutside={(event) => {
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('.pac-container')) event.preventDefault();
                }}
                onInteractOutside={(event) => {
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('.pac-container')) event.preventDefault();
                }}
            >
                <DialogHeader className="border-b border-white/10 px-6 pb-4 pt-6 text-left">
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
                        <MapPin className="h-5 w-5 text-primary" />
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-white/65">
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 px-6 pb-6">
                    {isLoggedIn ? (
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-white/80">{t('savedAddresses')}</Label>
                            <Select value={selectedId} onValueChange={handleAddressSelect}>
                                <SelectTrigger className="h-11 rounded-xl border-white/15 bg-white/10 text-white focus:ring-1 focus:ring-primary focus:ring-offset-0">
                                    <SelectValue placeholder={t('savedAddresses')} />
                                </SelectTrigger>
                                <SelectContent className="z-[400] border-white/15 bg-secondary text-white">
                                    <SelectItem className="text-white focus:bg-primary focus:text-white" value="new">
                                        {t('addNewAddress')}
                                    </SelectItem>
                                    {addresses.map((address) => (
                                        <SelectItem
                                            className="text-white focus:bg-primary focus:text-white"
                                            key={address._id}
                                            value={address._id}
                                        >
                                            {address.isDefault ? `${checkoutT('defaultBadge')} · ` : ''}
                                            {address.fullName ? `${address.fullName} — ` : ''}
                                            {address.address}, {address.city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <p className="text-xs text-white/65">{t('mapHint')}</p>
                        <div className="relative">
                            <div className="flex gap-2">
                                <input
                                    ref={searchRef}
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => handleSearchChange(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key !== 'Enter') return;
                                        event.preventDefault();
                                        if (suggestions[0]) {
                                            void selectSuggestion(suggestions[0]);
                                            return;
                                        }
                                        void searchByText(searchQuery);
                                    }}
                                    placeholder={t('searchPlaceholder')}
                                    className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => void searchByText(searchQuery)}
                                    disabled={searching || !searchQuery.trim()}
                                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-primary px-3 text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                                    aria-label={t('searchPlaceholder')}
                                >
                                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </button>
                            </div>
                            {suggestions.length > 0 ? (
                                <ul className="absolute z-[70] mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-white/15 bg-secondary py-1 shadow-2xl">
                                    {suggestions.map((suggestion) => (
                                        <li key={suggestion.placeId}>
                                            <button
                                                type="button"
                                                onMouseDown={(event) => event.preventDefault()}
                                                onClick={() => void selectSuggestion(suggestion)}
                                                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-white hover:bg-primary/20"
                                            >
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                <span>{suggestion.description}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <div
                                ref={mapNodeRef}
                                className="h-64 w-full bg-dark-brown"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={busy}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary/25 disabled:opacity-60"
                        >
                            {status === 'detecting' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Navigation className="h-4 w-4" />
                            )}
                            {status === 'detecting' ? t('detecting') : t('useCurrent')}
                        </button>
                        {mapCoords ? (
                            <p className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80">
                                {t('coordinates', {
                                    lat: form.latitude.toFixed(6),
                                    lng: form.longitude.toFixed(6),
                                })}
                            </p>
                        ) : (
                            <p className="text-xs text-primary">{t('pickOnMap')}</p>
                        )}
                    </div>

                    {isLoggedIn ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="loc-fullName" className="text-xs font-semibold text-white/80">
                                    {checkoutT('fullName')}
                                </Label>
                                <Input
                                    id="loc-fullName"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('fullNamePlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="loc-phone" className="text-xs font-semibold text-white/80">
                                    {checkoutT('phone')}
                                </Label>
                                <Input
                                    id="loc-phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('phonePlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="loc-postalCode" className="text-xs font-semibold text-white/80">
                                    {checkoutT('postalCode')}
                                </Label>
                                <Input
                                    id="loc-postalCode"
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('postalPlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="loc-city" className="text-xs font-semibold text-white/80">
                                    {checkoutT('city')}
                                </Label>
                                <Input
                                    id="loc-city"
                                    name="city"
                                    value={form.city}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('cityPlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="loc-state" className="text-xs font-semibold text-white/80">
                                    {checkoutT('zone')}
                                </Label>
                                <Input
                                    id="loc-state"
                                    name="state"
                                    value={form.state}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('zonePlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="loc-country" className="text-xs font-semibold text-white/80">
                                    {checkoutT('country')}
                                </Label>
                                <select
                                    id="loc-country"
                                    name="country"
                                    value={form.country}
                                    onChange={handleFieldChange}
                                    className={nativeSelectClass}
                                >
                                    <option value="" className="bg-secondary text-white">
                                        {checkoutT('selectCountry')}
                                    </option>
                                    {countries.map((country) => (
                                        <option
                                            key={country.countryCode || country.name}
                                            value={country.name}
                                            className="bg-secondary text-white"
                                        >
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="loc-address" className="text-xs font-semibold text-white/80">
                                    {checkoutT('address')}
                                </Label>
                                <Input
                                    id="loc-address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleFieldChange}
                                    placeholder={checkoutT('addressPlaceholder')}
                                    className={fieldClass}
                                />
                            </div>
                        </div>
                    ) : null}

                    {error ? <p className="text-xs text-red-300">{error}</p> : null}

                    {!isLoggedIn && draft?.label ? (
                        <p className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80">
                            <span className="font-semibold text-white">{t('selected')}: </span>
                            {draft.formattedAddress || draft.label}
                        </p>
                    ) : null}

                    <Button
                        type="button"
                        onClick={() => void handleApply()}
                        disabled={!canSubmit}
                        className="w-full rounded-xl bg-primary text-white hover:bg-primary-hover"
                    >
                        {status === 'saving' ? checkoutT('saving') : t('deliverHere')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
