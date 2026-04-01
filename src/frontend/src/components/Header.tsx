import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAllCategories } from "../hooks/useQueries";

export default function Header() {
  const { cartCount } = useCart();
  const { data: categories } = useAllCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery.trim() } });
    }
  }

  function handleSearchBtnMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.backgroundColor = "#E88B00";
  }
  function handleSearchBtnMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.backgroundColor = "#FF9900";
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div style={{ backgroundColor: "#131921" }} className="px-4 py-2">
        <div className="max-w-[1500px] mx-auto flex items-center gap-3">
          <Link to="/" className="flex-shrink-0 mr-2" data-ocid="header.link">
            <div className="flex flex-col items-center">
              <span
                className="text-white font-bold text-2xl tracking-tight"
                style={{ fontFamily: "serif" }}
              >
                amazon
              </span>
              <div
                className="w-full"
                style={{
                  backgroundColor: "#FF9900",
                  borderRadius: "50%",
                  height: "2px",
                  marginTop: "-2px",
                }}
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-start text-white cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded px-1 py-1 flex-shrink-0">
            <MapPin size={16} className="mt-1 text-gray-300" />
            <div className="ml-1">
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="text-sm font-bold text-white">United States</div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 flex min-w-0">
            <div className="flex w-full rounded overflow-hidden shadow">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="hidden md:block bg-gray-100 text-gray-700 text-xs px-2 border-r border-gray-300 focus:outline-none"
                style={{ minWidth: "80px" }}
              >
                <option>All</option>
                {categories?.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon Clone"
                className="flex-1 px-4 py-2 text-sm text-gray-900 focus:outline-none"
                data-ocid="header.search_input"
              />
              <button
                type="submit"
                className="px-4 flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#FF9900" }}
                onMouseEnter={handleSearchBtnMouseEnter}
                onMouseLeave={handleSearchBtnMouseLeave}
                data-ocid="header.submit_button"
              >
                <Search size={20} className="text-gray-900" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/admin"
              className="hidden md:flex flex-col text-white hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 cursor-pointer"
              data-ocid="header.link"
            >
              <span className="text-xs text-gray-300">Hello, sign in</span>
              <span className="text-sm font-bold flex items-center gap-0.5">
                Account & Lists <ChevronDown size={12} />
              </span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1 text-white hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 relative"
              data-ocid="header.link"
            >
              <div className="relative">
                <ShoppingCart size={28} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: "#FF9900", color: "#111" }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-sm font-bold">Cart</span>
            </Link>
            <button
              type="button"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#232F3E" }} className="px-4">
        <div className="max-w-[1500px] mx-auto flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            className="flex items-center gap-1 text-white text-sm py-2 px-3 hover:outline hover:outline-1 hover:outline-white rounded whitespace-nowrap font-medium"
          >
            <Menu size={16} /> All
          </button>
          {(
            [
              { label: "Today's Deals", href: "/" as const },
              { label: "Customer Service", href: "/" as const },
              { label: "Registry", href: "/" as const },
              { label: "Gift Cards", href: "/" as const },
              { label: "Sell", href: "/" as const },
              { label: "Admin Panel", href: "/admin" as const },
            ] as const
          ).map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-white text-sm py-2 px-3 hover:outline hover:outline-1 hover:outline-white rounded whitespace-nowrap"
              data-ocid="header.link"
            >
              {item.label}
            </Link>
          ))}
          {categories?.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="text-white text-sm py-2 px-3 hover:outline hover:outline-1 hover:outline-white rounded whitespace-nowrap"
              data-ocid="header.link"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: "#131921" }}
          className="md:hidden px-4 pb-4"
        >
          <form onSubmit={handleSearch} className="flex mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-3 py-2 text-sm rounded-l"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r"
              style={{ backgroundColor: "#FF9900" }}
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
