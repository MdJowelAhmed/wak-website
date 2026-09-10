import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";

export interface ServiceCreator {
    id: string;
    name: string;
    profileImage: string;
}

export interface ServiceDetailsData {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    price: number;
    deliveryTime: number;
    rating: number;
    reviewCount: number;
    categoryName: string;
    technologies: string[];
    includes: string[];
    packageDetails: string[];
    creator: ServiceCreator;
}

function readStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function mapServiceDetails(raw: unknown): ServiceDetailsData | null {
    if (!raw || typeof raw !== "object") return null;
    const row = raw as {
        _id?: string;
        slug?: string;
        name?: string;
        description?: string;
        image?: string;
        price?: number;
        deliveryTime?: number;
        averageRating?: number;
        ratingAverage?: number;
        ratingCount?: number;
        technologies?: unknown;
        serviceIncludes?: unknown;
        packageDetails?: unknown;
        category?: unknown;
        creator?: unknown;
    };

    if (!row._id || !row.name) return null;

    const category = row.category;
    let categoryName = "Service";
    if (typeof category === "string" && category) {
        categoryName = category;
    } else if (category && typeof category === "object" && "name" in category) {
        const name = (category as { name?: string }).name;
        if (name) categoryName = name;
    }

    const creatorRaw = row.creator;
    let creator: ServiceCreator = {
        id: "",
        name: "Service provider",
        profileImage: "/user.svg",
    };
    if (creatorRaw && typeof creatorRaw === "object") {
        const creatorRow = creatorRaw as {
            _id?: string;
            name?: string;
            profileImage?: string;
        };
        creator = {
            id: creatorRow._id || "",
            name: creatorRow.name || "Service provider",
            profileImage: resolveImageUrl(creatorRow.profileImage, "/user.svg") || "/user.svg",
        };
    }

    const rating = row.averageRating ?? row.ratingAverage ?? 0;

    return {
        id: row._id,
        slug: row.slug || row._id,
        name: row.name,
        description: row.description || "",
        image: resolveImageUrl(row.image, "/placeholder.jpg") || "/placeholder.jpg",
        price: typeof row.price === "number" ? row.price : 0,
        deliveryTime: typeof row.deliveryTime === "number" ? row.deliveryTime : 0,
        rating: typeof rating === "number" ? rating : 0,
        reviewCount: typeof row.ratingCount === "number" ? row.ratingCount : 0,
        categoryName,
        technologies: readStringArray(row.technologies),
        includes: readStringArray(row.serviceIncludes),
        packageDetails: readStringArray(row.packageDetails),
        creator,
    };
}

export function formatServicePrice(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}
