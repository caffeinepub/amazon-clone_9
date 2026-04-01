import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const imgSrc =
    product.imageUrl || `https://picsum.photos/seed/${index}/400/400`;
  const hasDiscount = product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div
      className="bg-white rounded shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col overflow-hidden group"
      data-ocid={`product.item.${index + 1}`}
    >
      <Link
        to="/products/$id"
        params={{ id: String(index) }}
        className="block relative overflow-hidden"
      >
        {product.badge && (
          <span
            className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: "#CC0C39", color: "white" }}
          >
            {product.badge}
          </span>
        )}
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${index + 10}/400/400`;
          }}
        />
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to="/products/$id" params={{ id: String(index) }}>
          <h3
            className="text-sm font-medium line-clamp-2 mb-1 hover:underline"
            style={{ color: "#0F1111" }}
          >
            {product.title}
          </h3>
        </Link>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
        />
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: "#B12704" }}>
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "#CC0C39" }}
              >
                -{discountPct}%
              </span>
            </>
          )}
        </div>
        {!product.inStock && (
          <span className="text-xs text-red-600 mt-1">Out of Stock</span>
        )}
        <button
          type="button"
          className="amz-orange-btn mt-3 w-full py-1.5 text-sm font-medium flex items-center justify-center gap-1.5"
          onClick={() => addToCart(index, product)}
          disabled={!product.inStock}
          data-ocid={`product.primary_button.${index + 1}`}
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
