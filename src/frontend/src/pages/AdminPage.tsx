import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Product } from "../backend";
import {
  useAddCategory,
  useAddProduct,
  useAllCategories,
  useAllProducts,
  useDeleteCategory,
  useDeleteProduct,
  useIsAdmin,
  useUpdateCategory,
  useUpdateProduct,
} from "../hooks/useQueries";

const emptyProduct: Product = {
  title: "",
  description: "",
  price: 0,
  originalPrice: 0,
  rating: 4,
  reviewCount: BigInt(0),
  category: "",
  imageUrl: "",
  badge: "",
  inStock: true,
};

const emptyCategory: Category = { name: "", slug: "" };

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

function ProductForm({
  initial,
  categories,
  onSave,
  onClose,
  isPending,
}: {
  initial: Product;
  categories: Category[];
  onSave: (p: Product) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<Product>(initial);

  function set(field: keyof Product, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label>Title</Label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          data-ocid="admin.input"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          data-ocid="admin.textarea"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) =>
              set("price", Number.parseFloat(e.target.value) || 0)
            }
            data-ocid="admin.input"
          />
        </div>
        <div>
          <Label>Original Price ($)</Label>
          <Input
            type="number"
            value={form.originalPrice}
            onChange={(e) =>
              set("originalPrice", Number.parseFloat(e.target.value) || 0)
            }
            data-ocid="admin.input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Rating (0-5)</Label>
          <Input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) =>
              set("rating", Number.parseFloat(e.target.value) || 0)
            }
            data-ocid="admin.input"
          />
        </div>
        <div>
          <Label>Review Count</Label>
          <Input
            type="number"
            value={Number(form.reviewCount)}
            onChange={(e) =>
              set("reviewCount", BigInt(Number.parseInt(e.target.value) || 0))
            }
            data-ocid="admin.input"
          />
        </div>
      </div>
      <div>
        <Label>Category</Label>
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          data-ocid="admin.select"
        >
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Image URL</Label>
        <Input
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://..."
          data-ocid="admin.input"
        />
      </div>
      <div>
        <Label>Badge (e.g., Best Seller)</Label>
        <Input
          value={form.badge}
          onChange={(e) => set("badge", e.target.value)}
          data-ocid="admin.input"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={form.inStock}
          onCheckedChange={(v) => set("inStock", v)}
          data-ocid="admin.switch"
        />
        <Label>In Stock</Label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          onClick={() => onSave(form)}
          disabled={isPending}
          style={{ backgroundColor: "#FF9900", color: "#111" }}
          data-ocid="admin.save_button"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Product
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          data-ocid="admin.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: categories, isLoading: categoriesLoading } = useAllCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    editId?: number;
    product?: Product;
  }>({ open: false });
  const [catDialog, setCatDialog] = useState<{
    open: boolean;
    editId?: number;
    category?: Category;
  }>({ open: false });
  const [catForm, setCatForm] = useState<Category>(emptyCategory);

  if (checkingAdmin) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-4 py-8"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-4 py-12 text-center"
        data-ocid="admin.error_state"
      >
        <Shield size={64} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Admin Access Required
        </h2>
        <p className="text-gray-500">
          You need admin privileges to access this panel.
        </p>
      </div>
    );
  }

  async function handleSaveProduct(product: Product) {
    try {
      if (productDialog.editId !== undefined) {
        await updateProduct.mutateAsync({ id: productDialog.editId, product });
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync(product);
        toast.success("Product added!");
      }
      setProductDialog({ open: false });
    } catch {
      toast.error("Failed to save product");
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted!");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  async function handleSaveCategory() {
    try {
      if (catDialog.editId !== undefined) {
        await updateCategory.mutateAsync({
          id: catDialog.editId,
          category: catForm,
        });
        toast.success("Category updated!");
      } else {
        await addCategory.mutateAsync(catForm);
        toast.success("Category added!");
      }
      setCatDialog({ open: false });
    } catch {
      toast.error("Failed to save category");
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted!");
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED" }}>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={28} style={{ color: "#FF9900" }} />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <Tabs defaultValue="products" data-ocid="admin.tab">
          <TabsList className="mb-4">
            <TabsTrigger value="products" data-ocid="admin.tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" data-ocid="admin.tab">
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="bg-white rounded shadow-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  Products ({products?.length ?? 0})
                </h2>
                <Dialog
                  open={productDialog.open}
                  onOpenChange={(o) => setProductDialog({ open: o })}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setProductDialog({ open: true })}
                      style={{ backgroundColor: "#FF9900", color: "#111" }}
                      data-ocid="admin.open_modal_button"
                    >
                      <Plus size={16} className="mr-1" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg" data-ocid="admin.dialog">
                    <DialogHeader>
                      <DialogTitle>
                        {productDialog.editId !== undefined ? "Edit" : "Add"}{" "}
                        Product
                      </DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      initial={productDialog.product ?? emptyProduct}
                      categories={categories ?? []}
                      onSave={handleSaveProduct}
                      onClose={() => setProductDialog({ open: false })}
                      isPending={
                        addProduct.isPending || updateProduct.isPending
                      }
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {productsLoading ? (
                <div className="space-y-2" data-ocid="admin.loading_state">
                  {SKELETON_KEYS.map((k) => (
                    <Skeleton key={k} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Badge</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product, i) => (
                        <TableRow
                          key={product.title}
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell>
                            <img
                              src={
                                product.imageUrl ||
                                `https://picsum.photos/seed/${i}/60/60`
                              }
                              alt={product.title}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  `https://picsum.photos/seed/${i + 5}/60/60`;
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px]">
                            <span className="line-clamp-2 text-sm">
                              {product.title}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.category}
                          </TableCell>
                          <TableCell
                            className="font-bold"
                            style={{ color: "#B12704" }}
                          >
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {product.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {product.badge}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.inStock
                                  ? "text-green-600 text-xs"
                                  : "text-red-600 text-xs"
                              }
                            >
                              {product.inStock ? "In Stock" : "Out"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setProductDialog({
                                    open: true,
                                    editId: i,
                                    product,
                                  })
                                }
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Pencil size={12} />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(i)}
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="bg-white rounded shadow-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  Categories ({categories?.length ?? 0})
                </h2>
                <Dialog
                  open={catDialog.open}
                  onOpenChange={(o) => setCatDialog({ open: o })}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setCatForm(emptyCategory);
                        setCatDialog({ open: true });
                      }}
                      style={{ backgroundColor: "#FF9900", color: "#111" }}
                      data-ocid="admin.open_modal_button"
                    >
                      <Plus size={16} className="mr-1" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="admin.dialog">
                    <DialogHeader>
                      <DialogTitle>
                        {catDialog.editId !== undefined ? "Edit" : "Add"}{" "}
                        Category
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={catForm.name}
                          onChange={(e) =>
                            setCatForm((f) => ({ ...f, name: e.target.value }))
                          }
                          data-ocid="admin.input"
                        />
                      </div>
                      <div>
                        <Label>Slug</Label>
                        <Input
                          value={catForm.slug}
                          onChange={(e) =>
                            setCatForm((f) => ({ ...f, slug: e.target.value }))
                          }
                          placeholder="electronics, books, fashion..."
                          data-ocid="admin.input"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleSaveCategory}
                          disabled={
                            addCategory.isPending || updateCategory.isPending
                          }
                          style={{ backgroundColor: "#FF9900", color: "#111" }}
                          data-ocid="admin.save_button"
                        >
                          {(addCategory.isPending ||
                            updateCategory.isPending) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Category
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCatDialog({ open: false })}
                          data-ocid="admin.cancel_button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {categoriesLoading ? (
                <div className="space-y-2" data-ocid="admin.loading_state">
                  {SKELETON_KEYS.map((k) => (
                    <Skeleton key={k} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2" data-ocid="admin.list">
                  {categories?.map((cat, i) => (
                    <div
                      key={cat.slug}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <div>
                        <span className="font-medium">{cat.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          /{cat.slug}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCatForm(cat);
                            setCatDialog({
                              open: true,
                              editId: i,
                              category: cat,
                            });
                          }}
                          data-ocid={`admin.edit_button.${i + 1}`}
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(i)}
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
