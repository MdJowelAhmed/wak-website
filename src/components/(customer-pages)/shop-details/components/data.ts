// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductDetail {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    images: string[];          // index 0 = main image
    aboutItems: string[];
    highlights: { label: string; value: string }[];
}

export interface RelatedProduct {
    id: number;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
}

// ─── Product detail data ──────────────────────────────────────────────────────

export const productDetail: ProductDetail = {
    id: 1,
    name: "Jr. Zoom Soccer Cleats",
    price: 1169,
    originalPrice: 1899,
    discount: 35,
    rating: 5,
    reviews: 88,
    inStock: true,
    images: [
        "https://i.pinimg.com/736x/b9/01/77/b901770298d6533f21e0844b2a8f84b7.jpg",
        "https://i.pinimg.com/1200x/63/df/bc/63dfbc2f12643ae6e22e69d8646fe3fe.jpg",
        "https://i.pinimg.com/1200x/ce/3e/37/ce3e37d5c77814a195575542fa010097.jpg",
    ],
    aboutItems: [
        "Upper is made from NikeSkin with embedded chevrons, which helps provide ball control.",
        "Adaptable knit that offers flexibility, provides support and brings you closer to the ball",
        "A Dynamic Fit collar wraps your ankle in soft, stretchy fabric for a secure feel",
        "Cascading studs provides the appropriate amount of grip",
        "Cushioned insole",
    ],
    highlights: [
        { label: "Color", value: "Ember Glow Aurora Green" },
        { label: "Cushioning Level", value: "Medium" },
        { label: "Sport Type", value: "Soccer" },
        { label: "Insole Cushioning", value: "Air" },
        { label: "Top highlights", value: "Synthetic, Textile Textile Rubber" },
        { label: "Sole material", value: "Rubber" },
        { label: "Shaft height", value: "Alla caviglia" },
        { label: "Outer material", value: "Faux Leather" },
    ],
};

// ─── Related products data ────────────────────────────────────────────────────

export const relatedProducts: RelatedProduct[] = [
    {
        id: 2,
        name: "RGB liquid CPU Cooler",
        image: "/product1.png",
        currentPrice: 120,
        originalPrice: 180,
        discount: 40,
        rating: 5,
        reviews: 88,
    },
    {
        id: 3,
        name: "Jr. Zoom Soccer Cleats",
        image: "/product3.png",
        currentPrice: 1169,
        originalPrice: 1899,
        discount: 0,
        rating: 5,
        reviews: 88,
    },
    {
        id: 4,
        name: "Small BookSelf",
        image: "/product4.png",
        currentPrice: 520,
        originalPrice: 580,
        discount: 0,
        rating: 5,
        reviews: 88,
    },
    {
        id: 5,
        name: "Gucci duffle bag",
        image: "/product2.png",
        currentPrice: 420,
        originalPrice: 580,
        discount: 24,
        rating: 4.5,
        reviews: 88,
    },
    {
        id: 6,
        name: "Gaming Chair Pro",
        image: "/product1.png",
        currentPrice: 320,
        originalPrice: 400,
        discount: 20,
        rating: 5,
        reviews: 95,
    },
];
