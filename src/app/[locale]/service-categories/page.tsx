import { getActiveCategories } from "../../../../helpers/categoryService";
import CategoryListPage from "@/shared/CategoryListPage";

export default async function ServiceCategoriesPage() {
    const res = await getActiveCategories({ type: "service" });
    const categories = res?.data || [];

    return (
        <CategoryListPage
            kind="service"
            initialCategories={categories}
        />
    );
}
