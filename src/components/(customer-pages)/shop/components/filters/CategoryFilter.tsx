"use client";

interface Category {
    _id: string;
    name: string;
}

interface CategoryFilterProps {
    categoriesList: Category[];
    selectedCategories: string[];
    setSelectedCategories: (val: string[]) => void;
}

export default function CategoryFilter({ categoriesList, selectedCategories, setSelectedCategories }: CategoryFilterProps) {
    return (
        <div>
            <h3 className="text-gray-900 font-medium text-sm mb-4">Category</h3>
            <select
                value={selectedCategories[0] || ""}
                onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategories(val ? [val] : []);
                }}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors cursor-pointer text-sm"
            >
                <option value="">All Categories</option>
                {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
