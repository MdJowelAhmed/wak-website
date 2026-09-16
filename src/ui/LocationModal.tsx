'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { getGoogleMapsKey, loadGoogleMaps } from '../../helpers/google-maps';
import {
    hasCoordinates,
    labelFromAddressComponents,
    mapCenterForCountry,
    type DeliveryLocation,
} from '../../helpers/delivery-location';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    countryCode: string;
    currentLocation: DeliveryLocation | null;
    onSelectLocation: (location: DeliveryLocation) => void;
}

function locationFromGeocoderResult(
    result: google.maps.GeocoderResult,
    lat: number,
    lng: number,
): DeliveryLocation {
    const get = (type: string) =>
        result.address_components.find((item) => item.types.includes(type))?.long_name;

    return {
        label: labelFromAddressComponents(result.address_components, result.formatted_address),
        formattedAddress: result.formatted_address,
        lat,
        lng,
        city: get('locality') || get('administrative_area_level_2') || get('administrative_area_level_1'),
        country: get('country'),
        postalCode: get('postal_code'),
    };
}

export default function LocationModal({
    isOpen,
    onClose,
    countryCode,
    currentLocation,
    onSelectLocation,
}: LocationModalProps) {
    const t = useTranslations('LocationModal');
    const searchRef = useRef<HTMLInputElement>(null);
    const mapNodeRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [draft, setDraft] = useState<DeliveryLocation | null>(currentLocation);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'detecting'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) setDraft(currentLocation);
    }, [isOpen, currentLocation]);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;
        let autocomplete: google.maps.places.Autocomplete | null = null;
        const listeners: google.maps.MapsEventListener[] = [];

        const applyLatLng = async (latLng: google.maps.LatLng) => {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: latLng });
            const result = response.results[0];
            if (!result || cancelled) return;
            setDraft(locationFromGeocoderResult(result, latLng.lat(), latLng.lng()));
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
                const saved = hasCoordinates(currentLocation) ? currentLocation : null;
                const center = saved
                    ? { lat: saved.lat, lng: saved.lng }
                    : { lat: fallback.lat, lng: fallback.lng };

                const map = new google.maps.Map(mapNodeRef.current, {
                    center,
                    zoom: saved ? 15 : fallback.zoom,
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

                if (searchRef.current) {
                    autocomplete = new google.maps.places.Autocomplete(searchRef.current, {
                        fields: ['formatted_address', 'geometry', 'address_components', 'name'],
                    });
                    listeners.push(
                        autocomplete.addListener('place_changed', () => {
                            const place = autocomplete?.getPlace();
                            const location = place?.geometry?.location;
                            if (!place || !location) return;
                            map.panTo(location);
                            map.setZoom(16);
                            marker.setPosition(location);
                            if (place.formatted_address && place.address_components) {
                                setDraft(
                                    locationFromGeocoderResult(
                                        {
                                            address_components: place.address_components,
                                            formatted_address: place.formatted_address,
                                        } as google.maps.GeocoderResult,
                                        location.lat(),
                                        location.lng(),
                                    ),
                                );
                                return;
                            }
                            void applyLatLng(location);
                        }),
                    );
                }

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
            autocomplete = null;
            mapRef.current = null;
            markerRef.current = null;
        };
    }, [isOpen, countryCode, currentLocation, t]);

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
                        setDraft(locationFromGeocoderResult(result, latLng.lat(), latLng.lng()));
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

    const handleApply = () => {
        if (!draft?.label) return;
        onSelectLocation(draft);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-card text-foreground border border-border rounded-2xl shadow-xl p-6">
                <DialogHeader className="border-b border-border pb-3">
                    <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-body-text">
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <input
                        ref={searchRef}
                        type="search"
                        placeholder={t('searchPlaceholder')}
                        className="w-full rounded-xl border border-border bg-section-bg px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-text focus:border-primary"
                    />

                    <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={status === 'detecting' || status === 'loading'}
                        className="w-full flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/20 text-primary border border-primary/30 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer disabled:opacity-60"
                    >
                        {status === 'detecting' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Navigation className="w-4 h-4" />
                        )}
                        {status === 'detecting' ? t('detecting') : t('useCurrent')}
                    </button>

                    <div
                        ref={mapNodeRef}
                        className="h-56 w-full overflow-hidden rounded-xl border border-border bg-section-bg"
                    />

                    {error ? <p className="text-xs text-error">{error}</p> : null}

                    {draft?.label ? (
                        <p className="rounded-xl bg-section-bg px-3 py-2 text-xs text-foreground">
                            <span className="font-semibold">{t('selected')}: </span>
                            {draft.formattedAddress || draft.label}
                        </p>
                    ) : null}

                    <Button
                        type="button"
                        onClick={handleApply}
                        disabled={!draft?.label}
                        className="w-full rounded-xl"
                    >
                        {t('deliverHere')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
