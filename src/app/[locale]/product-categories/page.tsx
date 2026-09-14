import { getActiveCategories } from "../../../../helpers/categoryService";
import CategoryListPage from "@/shared/CategoryListPage";

export default async function ProductCategoriesPage() {
    const res = await getActiveCategories({ type: "product" });
    const categories = res?.data || [];

    return (
        <CategoryListPage
            kind="product"
            initialCategories={categories}
        />
    );
}
