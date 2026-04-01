import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import CategorySidebar from "../components/CategorySidebar";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import { useAllCategories, useAllProducts } from "../hooks/useQueries";

const categoryShortcuts = [
  { label: "Electronics", slug: "electronics", emoji: "💻", color: "#1a1a2e" },
  { label: "Books", slug: "books", emoji: "📚", color: "#7c2d12" },
  { label: "Fashion", slug: "fashion", emoji: "👗", color: "#2d1b69" },
  {
    label: "Home & Kitchen",
    slug: "home-kitchen",
    emoji: "🏠",
    color: "#134e4a",
  },
  { label: "Sports", slug: "sports", emoji: "⚽", color: "#14532d" },
  { label: "Beauty", slug: "beauty", emoji: "💄", color: "#831843" },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function HomePage() {
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useAllCategories();

  const todayDeals = products?.slice(0, 8) ?? [];
  const featured = products?.slice(8, 16) ?? [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <HeroBanner />

      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <section
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6"
          data-ocid="categories.section"
        >
          {categoryShortcuts.map((cat) => (
            <Link
              key={cat.slug}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="bg-white rounded shadow-card hover:shadow-card-hover transition-all duration-200 p-3 flex flex-col items-center gap-2 group"
              data-ocid="categories.link"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${cat.color}22` }}
              >
                {cat.emoji}
              </div>
              <span className="text-xs font-medium text-center text-gray-800">
                {cat.label}
              </span>
            </Link>
          ))}
        </section>

        <div className="flex gap-4">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>

          <div className="flex-1 min-w-0">
            <section className="mb-6" data-ocid="deals.section">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Deals
                </h2>
                <Link
                  to="/"
                  className="text-sm flex items-center gap-1 hover:underline"
                  style={{ color: "#007185" }}
                  data-ocid="deals.link"
                >
                  See all deals <ChevronRight size={14} />
                </Link>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SKELETON_KEYS.map((k) => (
                    <Skeleton key={k} className="h-64" />
                  ))}
                </div>
              ) : todayDeals.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {todayDeals.map((product, i) => (
                    <ProductCard
                      key={product.title}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-10 text-gray-500"
                  data-ocid="deals.empty_state"
                >
                  No deals available right now.
                </div>
              )}
            </section>

            {featured.length > 0 && (
              <section className="mb-6" data-ocid="featured.section">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Featured Products
                  </h2>
                  <Link
                    to="/"
                    className="text-sm flex items-center gap-1 hover:underline"
                    style={{ color: "#007185" }}
                  >
                    See more <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {featured.map((product, i) => (
                    <ProductCard
                      key={product.title}
                      product={product}
                      index={i + 8}
                    />
                  ))}
                </div>
              </section>
            )}

            {categories && categories.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to="/category/$slug"
                      params={{ slug: cat.slug }}
                      className="bg-white rounded shadow-card hover:shadow-card-hover p-4 flex items-center gap-3 group transition-all"
                      data-ocid="category.link"
                    >
                      <span className="text-2xl">
                        {categoryShortcuts.find((c) => c.slug === cat.slug)
                          ?.emoji ?? "📦"}
                      </span>
                      <span className="font-medium text-gray-800 group-hover:underline">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
