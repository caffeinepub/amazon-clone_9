import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Product } from "../backend";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProduct(BigInt(id));
    },
    enabled: !!actor && !isFetching && id >= 0,
  });
}

export function useProductsByCategory(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", slug],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useSearchProducts(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", keyword],
    queryFn: async () => {
      if (!actor || !keyword) return [];
      return actor.searchProducts(keyword);
    },
    enabled: !!actor && !isFetching && keyword.length > 0,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product }: { id: number; product: Product }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(BigInt(id), product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(BigInt(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: Category) => {
      if (!actor) throw new Error("No actor");
      return actor.addCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      category,
    }: { id: number; category: Category }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCategory(BigInt(id), category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCategory(BigInt(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
