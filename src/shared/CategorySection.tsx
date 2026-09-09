import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "../../helpers/categoryService";
import type { CategoryKind } from "../../helpers/categoryUtils";
import CategoryCard from "./CategoryCard";

interface CategorySectionProps {
    title: string;
    viewAllHref: string;
    categories: Category[];
    kind: CategoryKind;
    emptyMessage: string;
}

export default function CategorySection({
    title,
    viewAllHref,
    categories,
    kind,
    emptyMessage,
}: CategorySectionProps) {
    return (
        <div className="container mx-auto mb-2 md:mb-3">
            <div className="mb-2 flex items-center justify-between md:mb-4">
                <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl lg:text-2xl">
                    {title}
                </h2>
                <Link
                    href={viewAllHref}
                    className="group flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground transition-all hover:underline hover:underline-offset-4 sm:text-sm"
                >
                    View All
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {categories.length > 0 ? (
                <div className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-3 sm:gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                            kind={kind}
                            layout="row"
                        />
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center text-sm text-accent">{emptyMessage}</div>
            )}
        </div>
    );
}
