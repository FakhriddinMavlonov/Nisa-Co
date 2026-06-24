"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Globe,
  Package,
  Image as ImageIcon,
  Ruler,
  Search,
} from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  nameEn: string;
}

interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  order?: number;
}

interface ProductSize {
  id?: string;
  name: string;
  stock: number;
}

interface Product {
  id: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  descriptionEn: string;
  descriptionUz: string;
  descriptionNo: string;
  descriptionSv: string;
  descriptionEs: string;
  price: number;
  currency: string;
  categoryId: string;
  featured: boolean;
  inStock: boolean;
  images: ProductImage[];
  sizes: ProductSize[];
  seoTitleEn?: string;
  seoDescEn?: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

const LANGS = [
  { code: "En", label: "English", flag: "🇬🇧", required: true },
  { code: "Uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "No", label: "Norsk", flag: "🇳🇴" },
  { code: "Sv", label: "Svenska", flag: "🇸🇪" },
  { code: "Es", label: "Español", flag: "🇪🇸" },
];

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [activeTab, setActiveTab] = useState<"basic" | "lang" | "images" | "sizes" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [nameEn, setNameEn] = useState(product?.nameEn || "");
  const [nameUz, setNameUz] = useState(product?.nameUz || "");
  const [nameNo, setNameNo] = useState(product?.nameNo || "");
  const [nameSv, setNameSv] = useState(product?.nameSv || "");
  const [nameEs, setNameEs] = useState(product?.nameEs || "");
  const [descEn, setDescEn] = useState(product?.descriptionEn || "");
  const [descUz, setDescUz] = useState(product?.descriptionUz || "");
  const [descNo, setDescNo] = useState(product?.descriptionNo || "");
  const [descSv, setDescSv] = useState(product?.descriptionSv || "");
  const [descEs, setDescEs] = useState(product?.descriptionEs || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [currency, setCurrency] = useState(product?.currency || "GBP");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [inStock, setInStock] = useState(product?.inStock !== false);
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes || []);
  const [seoTitleEn, setSeoTitleEn] = useState(product?.seoTitleEn || "");
  const [seoDescEn, setSeoDescEn] = useState(product?.seoDescEn || "");

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        console.error("Upload server error:", data?.error ?? res.status);
        alert("Upload xatoligi: " + (data?.error ?? "Server error " + res.status));
        return;
      }

      if (data.urls) {
        const newImages: ProductImage[] = data.urls.map((url: string) => ({ url, alt: nameEn }));
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }, [nameEn]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  }, [handleImageUpload]);

  const addSize = () => setSizes((prev) => [...prev, { name: "", stock: 0 }]);
  const removeSize = (index: number) => setSizes((prev) => prev.filter((_, i) => i !== index));
  const updateSize = (index: number, field: "name" | "stock", value: string | number) => {
    setSizes((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nameEn.trim()) errs.nameEn = "Product name (English) is required";
    if (!price || parseFloat(price) <= 0) errs.price = "Valid price is required";
    if (!categoryId) errs.categoryId = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setActiveTab("basic");
      return;
    }
    setSaving(true);

    const payload = {
      nameEn, nameUz, nameNo, nameSv, nameEs,
      descriptionEn: descEn, descriptionUz: descUz, descriptionNo: descNo,
      descriptionSv: descSv, descriptionEs: descEs,
      price, currency, categoryId, featured, inStock,
      images, sizes,
      seoTitleEn, seoDescEn,
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Failed to save" });
      }
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "lang", label: "Languages", icon: Globe },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "sizes", label: "Sizes", icon: Ruler },
    { id: "seo", label: "SEO", icon: Search },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {isEdit ? `Editing: ${product.nameEn}` : "Fill in the product details"}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-900 border border-white/5 rounded-2xl p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-brand-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {activeTab === "basic" && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Product Name (English) <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Floral Silk Dress"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 text-sm ${
                      errors.nameEn ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-brand-500 focus:ring-brand-500"
                    }`}
                  />
                  {errors.nameEn && <p className="text-red-400 text-xs mt-1">{errors.nameEn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`flex-1 px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 text-sm ${
                        errors.price ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-brand-500 focus:ring-brand-500"
                      }`}
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
                    >
                      <option value="GBP">GBP £</option>
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="NOK">NOK kr</option>
                      <option value="SEK">SEK kr</option>
                    </select>
                  </div>
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                    errors.categoryId ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-brand-500 focus:ring-brand-500"
                  } ${!categoryId && "text-gray-600"}`}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId}</p>}
                {categories.length === 0 && (
                  <p className="text-yellow-500 text-xs mt-1">
                    No categories yet. <a href="/admin/categories" className="underline">Create one first.</a>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Description (English)
                </label>
                <textarea
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm resize-none"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setFeatured(!featured)}
                    className={`w-10 h-5 rounded-full transition-colors ${featured ? "bg-brand-500" : "bg-gray-700"} relative`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-gray-300">Featured</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setInStock(!inStock)}
                    className={`w-10 h-5 rounded-full transition-colors ${inStock ? "bg-green-500" : "bg-gray-700"} relative`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${inStock ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-gray-300">In Stock</span>
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === "lang" && (
            <motion.div key="lang" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              {LANGS.filter((l) => l.code !== "En").map((lang) => {
                const names: Record<string, [string, (v: string) => void]> = {
                  Uz: [nameUz, setNameUz],
                  No: [nameNo, setNameNo],
                  Sv: [nameSv, setNameSv],
                  Es: [nameEs, setNameEs],
                };
                const descs: Record<string, [string, (v: string) => void]> = {
                  Uz: [descUz, setDescUz],
                  No: [descNo, setDescNo],
                  Sv: [descSv, setDescSv],
                  Es: [descEs, setDescEs],
                };
                const [nameVal, setNameVal] = names[lang.code];
                const [descVal, setDescVal] = descs[lang.code];

                return (
                  <div key={lang.code} className="border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">{lang.flag}</span>
                      <h3 className="font-semibold text-white">{lang.label}</h3>
                      <span className="text-xs text-gray-500 ml-auto">Optional</span>
                    </div>
                    <div className="space-y-4">
                      <input
                        value={nameVal}
                        onChange={(e) => setNameVal(e.target.value)}
                        placeholder={`Product name in ${lang.label}`}
                        className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm"
                      />
                      <textarea
                        value={descVal}
                        onChange={(e) => setDescVal(e.target.value)}
                        placeholder={`Description in ${lang.label}`}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-gray-500 text-xs">If left empty, the English version will be used as fallback.</p>
            </motion.div>
          )}

          {activeTab === "images" && (
            <motion.div key="images" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  dragOver ? "border-brand-500 bg-brand-500/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Drop images here</p>
                      <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP up to 10MB each</p>
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Images grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800">
                      {img.url && (
                        <Image
                          src={img.url}
                          alt={img.alt || ""}
                          fill
                          sizes="20vw"
                          unoptimized={img.url.startsWith("/")}
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full font-medium">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "sizes" && (
            <motion.div key="sizes" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              <p className="text-gray-400 text-sm">Add available sizes and stock quantities.</p>

              {sizes.map((size, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    value={size.name}
                    onChange={(e) => updateSize(i, "name", e.target.value)}
                    placeholder="Size (e.g. S, M, L, XL, UK8)"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm"
                  />
                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) => updateSize(i, "stock", parseInt(e.target.value) || 0)}
                    placeholder="Stock"
                    min="0"
                    className="w-24 px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm text-center"
                  />
                  <button
                    onClick={() => removeSize(i)}
                    className="w-10 h-10 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addSize}
                className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 hover:border-white/30 rounded-xl text-gray-400 hover:text-white transition-all text-sm w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                Add Size
              </button>

              {/* Quick size presets */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {[["XS", "S", "M", "L", "XL"], ["UK6", "UK8", "UK10", "UK12", "UK14"]].map((set, si) => (
                    <button
                      key={si}
                      onClick={() => setSizes((prev) => [...prev, ...set.map((name) => ({ name, stock: 10 }))])}
                      className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors"
                    >
                      {set.join(", ")}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "seo" && (
            <motion.div key="seo" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              <p className="text-gray-400 text-sm">Optimize for search engines. These override the default product name/description.</p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">SEO Title (English)</label>
                <input
                  value={seoTitleEn}
                  onChange={(e) => setSeoTitleEn(e.target.value)}
                  placeholder="e.g. Buy Floral Silk Dress | Nisa&Co Premium Fashion"
                  maxLength={60}
                  className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm"
                />
                <p className="text-gray-600 text-xs mt-1">{seoTitleEn.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">SEO Description (English)</label>
                <textarea
                  value={seoDescEn}
                  onChange={(e) => setSeoDescEn(e.target.value)}
                  placeholder="e.g. Shop our elegant Floral Silk Dress at Nisa&Co. Premium quality fashion with free shipping."
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm resize-none"
                />
                <p className="text-gray-600 text-xs mt-1">{seoDescEn.length}/160 characters</p>
              </div>

              {/* SEO Preview */}
              {(seoTitleEn || nameEn) && (
                <div className="border border-white/10 rounded-xl p-4 bg-gray-800/50">
                  <p className="text-xs text-gray-500 mb-3">Google Preview</p>
                  <p className="text-blue-400 text-sm font-medium">{seoTitleEn || `${nameEn} | Nisa&Co`}</p>
                  <p className="text-green-600 text-xs mt-0.5">nisa.co.uk/en/products/...</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {seoDescEn || descEn || "No description provided."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <motion.button
          onClick={handleSubmit}
          disabled={saving}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? "Update Product" : "Create Product"}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
