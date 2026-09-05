import { getActiveCategories } from "../../../helpers/categoryService";
import ProductCategoryClient from "./ProductCategoryClient";

export default async function ProductCategoriesPage() {
    const res = await getActiveCategories({ type: 'product' });
    const categories = res?.data || [];

    return <ProductCategoryClient initialCategories={categories} />;
}
