# Amazon Clone

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Full-stack Amazon-like e-commerce demo site
- Homepage with header (logo, search bar, cart icon, nav links)
- Hero banner/carousel with promotional offers
- Product listing sections: "Today's Deals", "Featured Products", category rows
- Product cards: image, title, price, star ratings, "Add to Cart" button
- Product detail page with full info, images, reviews, add to cart
- Shopping cart page with quantity controls and order summary
- Category navigation sidebar
- Footer with links (About, Help, Careers, Privacy, etc.)
- Admin panel: add, edit, remove products and categories
- Sample seed products with categories and data
- Color scheme: dark navy header (#131921), orange accents (#FF9900), similar to Amazon

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Product type: id, title, description, price, originalPrice, category, imageUrl, rating, reviewCount, badge (e.g. "Best Seller"), inStock
- Category type: id, name, slug
- Cart item type: productId, quantity
- Stable storage for products, categories
- CRUD operations for products and categories (admin)
- Query: get all products, get by category, get by id, search by keyword
- Seed sample products and categories on first run
- Cart state managed client-side (no auth needed for demo)

### Frontend (React/TypeScript)
- Pages: Home, ProductDetail, Cart, Admin
- React Router for navigation
- Header component: logo, search, cart count badge, nav links (Returns, Orders, Account)
- HeroBanner: auto-rotating carousel of 3-4 promo banners
- ProductCard component: image, title, price (with crossed-out original), star rating, badge, Add to Cart
- ProductGrid: horizontal scroll row with section header
- CategorySidebar: list of category links
- CartPage: line items, quantity +/-, remove, subtotal, checkout CTA
- ProductDetailPage: large image, details, ratings, add to cart
- AdminPanel: table of products with edit/delete, add new product form, category management
- Global cart state via React context
- Sample images from picsum or placeholder service
