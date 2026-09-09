import { getActiveCategories } from "../../../helpers/categoryService";
import CategoryListPage from "@/shared/CategoryListPage";

export default async function ProductCategoriesPage() {
    const res = await getActiveCategories({ type: "product" });
    const categories = res?.data || [];

    return (
        <CategoryListPage
            title="Product Categories"
            description="Browse all available product categories or filter by featured categories."
            kind="product"
            initialCategories={categories}
        />
    );
}
