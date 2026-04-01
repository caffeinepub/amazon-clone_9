import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { SeedInitializer } from "./App";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";

function RootLayout() {
  return (
    <CartProvider>
      <SeedInitializer />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </CartProvider>
  );
}

export const rootRoute = createRootRoute({ component: RootLayout });

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$slug",
  component: CategoryPage,
});

export const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  cartRoute,
  adminRoute,
  categoryRoute,
  searchRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
