import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div
            className="bg-white rounded shadow-card p-12 text-center"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-medium text-gray-700 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add items to your cart to see them here.
            </p>
            <Link
              to="/"
              className="inline-block py-2 px-8 font-medium rounded amz-orange-btn"
              data-ocid="cart.link"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <h1 className="text-3xl font-normal mb-4">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div
              className="bg-white rounded shadow-card p-4"
              data-ocid="cart.table"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <span className="text-sm text-gray-600">Price</span>
              </div>

              {cartItems.map((item, idx) => (
                <div
                  key={item.productId}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <img
                    src={
                      item.product.imageUrl ||
                      `https://picsum.photos/seed/${item.productId}/200/200`
                    }
                    alt={item.product.title}
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${item.productId + 5}/200/200`;
                    }}
                  />
                  <div className="flex-1">
                    <Link
                      to="/products/$id"
                      params={{ id: String(item.productId) }}
                      className="font-medium text-gray-900 hover:underline line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-green-700 text-sm mt-1">In Stock</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          data-ocid={`cart.secondary_button.${idx + 1}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          data-ocid={`cart.secondary_button.${idx + 1}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                        onClick={() => {
                          removeFromCart(item.productId);
                          toast.success("Item removed from cart");
                        }}
                        data-ocid={`cart.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}

              <div className="text-right pt-3 text-lg">
                Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                items):{" "}
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="lg:w-72 flex-shrink-0" data-ocid="cart.panel">
            <div className="bg-white rounded shadow-card p-4">
              <div className="text-lg mb-3">
                Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                items):{" "}
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Estimated Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2 mb-4">
                <span>Order Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="amz-orange-btn w-full py-2.5 font-medium mb-2"
                onClick={() => {
                  toast.success("Order placed! (Demo)");
                  clearCart();
                }}
                data-ocid="cart.submit_button"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                className="w-full py-2 text-sm text-gray-600 hover:text-red-600 border rounded transition-colors"
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
                data-ocid="cart.delete_button"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
