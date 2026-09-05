import { getActiveCategories } from "../../../helpers/categoryService";
import ServiceCategoryClient from "./ServiceCategoryClient";

export default async function ServiceCategoriesPage() {
    const res = await getActiveCategories({ type: 'service' });
    const categories = res?.data || [];

    return <ServiceCategoryClient initialCategories={categories} />;
}
