import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    name: string;
    slug: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    title: string;
    inStock: boolean;
    originalPrice: number;
    description: string;
    imageUrl: string;
    category: string;
    badge: string;
    rating: number;
    price: number;
    reviewCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: Category): Promise<bigint>;
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCategory(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllProductsByPrice(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: bigint): Promise<Category>;
    getCategoryBySlug(slug: string): Promise<Category>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(categorySlug: string): Promise<Array<Product>>;
    getProductsByFilter(category: string, sortByPrice: boolean): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    seed(): Promise<void>;
    updateCategory(id: bigint, category: Category): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<void>;
}
