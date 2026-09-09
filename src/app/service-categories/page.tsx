import { getActiveCategories } from "../../../helpers/categoryService";
import CategoryListPage from "@/shared/CategoryListPage";

export default async function ServiceCategoriesPage() {
    const res = await getActiveCategories({ type: "service" });
    const categories = res?.data || [];

    return (
        <CategoryListPage
            title="Service Categories"
            description="Browse all available service categories or filter by featured categories."
            kind="service"
            initialCategories={categories}
        />
    );
}
