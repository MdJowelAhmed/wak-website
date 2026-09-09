import Image from "next/image";
import Link from "next/link";
import type { Category } from "../../helpers/categoryService";
import { getCategoryHref, type CategoryKind } from "../../helpers/categoryUtils";
import { resolveImageUrl } from "../../helpers/resolveImageUrl";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    category: Category;
    kind: CategoryKind;
    layout?: "row" | "grid";
}

export default function CategoryCard({
    category,
    kind,
    layout = "row",
}: CategoryCardProps) {
    return (
        <Link
            href={getCategoryHref(category, kind)}
            className={cn(
                "group inline-flex h-[150px] shrink-0 cursor-pointer select-none flex-col items-center justify-between gap-2 rounded-2xl bg-secondary p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/90 hover:shadow-xl sm:h-[165px] sm:p-2.5",
                layout === "row" && "w-32 sm:w-48",
                layout === "grid" && "h-[165px] w-full sm:h-[180px]",
            )}
        >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl shadow-inner sm:h-28">
                <Image
                    src={resolveImageUrl(category.image) || "/placeholder.jpg"}
                    alt={category.name}
                    fill
                    sizes={layout === "row" ? "192px" : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"}
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <span className="w-full break-words px-1 text-center text-xs leading-tight text-foreground line-clamp-2 whitespace-normal transition-colors group-hover:text-foreground/90 sm:text-sm">
                {category.name}
            </span>
        </Link>
    );
}
