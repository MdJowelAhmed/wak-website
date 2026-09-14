import { getTranslations } from "next-intl/server";
import type { Category } from "../../../../../helpers/categoryService";
import CategorySection from "@/shared/CategorySection";

interface AllBrandsProps {
    productCategories?: Category[];
    serviceCategories?: Category[];
}

const AllBrands = async ({
    productCategories = [],
    serviceCategories = [],
}: AllBrandsProps) => {
    const t = await getTranslations("Home");

    return (
        <section className="mb-3 bg-background md:mb-6">
            <CategorySection
                title={t("categories.products")}
                viewAllHref="/product-categories"
                viewAllLabel={t("viewAll")}
                categories={productCategories}
                kind="product"
                emptyMessage={t("categories.emptyProducts")}
            />
            <CategorySection
                title={t("categories.services")}
                viewAllHref="/service-categories"
                viewAllLabel={t("viewAll")}
                categories={serviceCategories}
                kind="service"
                emptyMessage={t("categories.emptyServices")}
            />
        </section>
    );
};

export default AllBrands;
