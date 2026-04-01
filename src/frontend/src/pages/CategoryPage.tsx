import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import { useAllCategories, useProductsByCategory } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function CategoryPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { data: products, isLoading } = useProductsByCategory(slug ?? "");
  const { data: categories } = useAllCategories();

  const categoryName = categories?.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
        <div className="flex gap-4">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-64" />
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div
                className="bg-white rounded shadow-card p-12 text-center"
                data-ocid="category.empty_state"
              >
                <p className="text-gray-500 text-lg">
                  No products found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.title}
                    product={product}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
