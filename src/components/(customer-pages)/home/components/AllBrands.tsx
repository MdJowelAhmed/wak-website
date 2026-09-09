import type { Category } from "../../../../../helpers/categoryService";
import CategorySection from "@/shared/CategorySection";

interface AllBrandsProps {
    productCategories?: Category[];
    serviceCategories?: Category[];
}

const AllBrands = ({
    productCategories = [],
    serviceCategories = [],
}: AllBrandsProps) => {
    return (
        <section className="mb-3 bg-background md:mb-6">
            <CategorySection
                title="Product Categories"
                viewAllHref="/product-categories"
                categories={productCategories}
                kind="product"
                emptyMessage="No product categories found"
            />
            <CategorySection
                title="Service Categories"
                viewAllHref="/service-categories"
                categories={serviceCategories}
                kind="service"
                emptyMessage="No service categories found"
            />
        </section>
    );
};

export default AllBrands;
