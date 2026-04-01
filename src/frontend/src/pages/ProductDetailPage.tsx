import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import { useCart } from "../context/CartContext";
import { useAllProducts, useProduct } from "../hooks/useQueries";

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const productId = Number(id ?? 0);
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: allProducts } = useAllProducts();
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="bg-white rounded shadow-card p-6 flex gap-8">
          <Skeleton className="w-80 h-80 flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-4 py-6 text-center"
        data-ocid="product.error_state"
      >
        <p className="text-red-600 text-lg">Product not found.</p>
        <Link
          to="/"
          className="hover:underline mt-2 inline-block"
          style={{ color: "#007185" }}
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  const imgSrc =
    product.imageUrl || `https://picsum.photos/seed/${productId}/600/600`;
  const hasDiscount = product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const related =
    allProducts
      ?.filter((p, i) => i !== productId && p.category === product.category)
      .slice(0, 4) ?? [];

  function handleAddToCart() {
    addToCart(productId, product!);
    toast.success(`"${product!.title}" added to cart!`);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <nav
          className="flex items-center gap-2 text-sm mb-4"
          aria-label="breadcrumb"
        >
          <Link to="/" className="hover:underline" style={{ color: "#007185" }}>
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            className="hover:underline"
            style={{ color: "#007185" }}
          >
            {product.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 line-clamp-1">{product.title}</span>
        </nav>

        <div
          className="bg-white rounded shadow-card p-6 flex flex-col lg:flex-row gap-8"
          data-ocid="product.card"
        >
          <div className="flex-shrink-0 flex flex-col items-center">
            <img
              src={imgSrc}
              alt={product.title}
              className="w-full max-w-sm h-96 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://picsum.photos/seed/${productId + 10}/600/600`;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {product.badge && (
              <span
                className="inline-block text-xs font-bold px-2 py-0.5 rounded mb-2"
                style={{ backgroundColor: "#CC0C39", color: "white" }}
              >
                {product.badge}
              </span>
            )}
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              {product.title}
            </h1>
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            <div className="border-t my-4" />

            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="text-3xl font-normal"
                style={{ color: "#B12704" }}
              >
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-500">
                    List:{" "}
                    <span className="line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#CC0C39" }}
                  >
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="mb-4">
              <span
                className={`text-sm font-medium ${
                  product.inStock ? "text-green-700" : "text-red-600"
                }`}
              >
                {product.inStock ? "✓ In Stock" : "✗ Currently unavailable"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xs">
              <button
                type="button"
                className="amz-orange-btn flex-1 py-2.5 font-medium flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-ocid="product.primary_button"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 font-medium flex items-center justify-center gap-2 text-gray-900 transition-colors"
                style={{
                  backgroundColor: "#FF9900",
                  border: "1px solid #FF8F00",
                  borderRadius: "20px",
                }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-ocid="product.secondary_button"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>

          <div className="lg:w-56 flex-shrink-0">
            <div className="border rounded p-4 text-sm space-y-3">
              <div className="text-2xl font-bold" style={{ color: "#B12704" }}>
                ${product.price.toFixed(2)}
              </div>
              <div className="text-green-700 font-medium">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
              <button
                type="button"
                className="amz-orange-btn w-full py-2"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-ocid="product.submit_button"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="w-full py-2 font-medium text-gray-900"
                style={{ backgroundColor: "#FF9900", borderRadius: "20px" }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p, i) => {
                const idx = allProducts?.indexOf(p) ?? i;
                return <ProductCard key={idx} product={p} index={idx} />;
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
