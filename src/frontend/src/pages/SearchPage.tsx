import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import { useSearchProducts } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function SearchPage() {
  const search = useSearch({ strict: false }) as { q?: string };
  const q = search.q ?? "";
  const { data: products, isLoading } = useSearchProducts(q);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <h1 className="text-lg mb-4">
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <span className="text-gray-500">
                {products?.length ?? 0} results for
              </span>{" "}
              <span className="font-bold text-gray-900">"{q}"</span>
            </>
          )}
        </h1>
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
                data-ocid="search.empty_state"
              >
                <p className="text-gray-500 text-lg">
                  No results found for "{q}"
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
