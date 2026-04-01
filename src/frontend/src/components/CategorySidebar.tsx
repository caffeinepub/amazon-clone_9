import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { useAllCategories } from "../hooks/useQueries";

const categoryIcons: Record<string, string> = {
  electronics: "💻",
  books: "📚",
  fashion: "👗",
  "home-kitchen": "🏠",
  sports: "⚽",
  toys: "🧸",
  beauty: "💄",
  automotive: "🚗",
  grocery: "🛒",
};

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function CategorySidebar() {
  const { data: categories, isLoading } = useAllCategories();
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug;

  return (
    <aside className="w-56 flex-shrink-0" data-ocid="sidebar.panel">
      <div className="bg-white rounded shadow-card p-3">
        <h3 className="font-bold text-sm mb-3 pb-2 border-b">Department</h3>
        {isLoading ? (
          <div className="space-y-2">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-6 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/"
                className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                  !slug
                    ? "font-bold text-gray-900 bg-orange-50 border-l-4 border-amz-orange"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                data-ocid="sidebar.link"
              >
                All Departments
              </Link>
            </li>
            {categories?.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                    slug === cat.slug
                      ? "font-bold text-gray-900 bg-orange-50 border-l-4 border-amz-orange"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-ocid="sidebar.link"
                >
                  <span>{categoryIcons[cat.slug] || "📦"}</span>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded shadow-card p-3 mt-3">
        <h3 className="font-bold text-sm mb-3 pb-2 border-b">
          Avg. Customer Review
        </h3>
        {[4, 3, 2, 1].map((stars) => (
          <div
            key={stars}
            className="flex items-center gap-2 py-1 cursor-pointer"
          >
            <span style={{ color: "#FF9900" }}>
              {"★".repeat(stars)}
              {"☆".repeat(4 - stars)}
            </span>
            <span className="text-sm" style={{ color: "#007185" }}>
              &amp; Up
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
