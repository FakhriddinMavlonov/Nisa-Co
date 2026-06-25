"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Package, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Product {
  id: string;
  nameEn: string;
  price: number;
  currency: string;
  featured: boolean;
  inStock: boolean;
  images: { url: string }[];
  sizes: { name: string }[];
  category: { nameEn: string };
  createdAt: Date;
}

interface AdminProductsListProps {
  products: Product[];
}

export function AdminProductsList({ products: initialProducts }: AdminProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const t = useTranslations("admin");

  const filtered = products.filter((p) =>
    p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    p.category.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("products")}</h1>
          <p className="text-gray-400 text-sm mt-1">{t("productCount", { count: products.length })}</p>
        </div>
        <Link href="/admin/products/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("addProduct")}
          </motion.button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchProducts")}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm"
        />
      </div>

      {/* Products Table */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">{t("noProductsFound")}</p>
            <Link href="/admin/products/new" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
              {t("addFirstProduct")}
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">{t("colProduct")}</div>
              <div className="col-span-2 hidden md:block">{t("colCategory")}</div>
              <div className="col-span-2 hidden md:block">{t("colPrice")}</div>
              <div className="col-span-2 hidden md:block">{t("colStatus")}</div>
              <div className="col-span-3 md:col-span-1 text-right">{t("colActions")}</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/2 transition-colors items-center"
                >
                  {/* Product */}
                  <div className="col-span-9 md:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                      {product.images[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.nameEn}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">{product.nameEn}</p>
                        {product.featured && <Star className="w-3 h-3 text-gold-400 fill-gold-400 flex-shrink-0" />}
                      </div>
                      <p className="text-gray-500 text-xs">
                        {product.sizes.length > 0
                          ? product.sizes.map((s) => s.name).join(", ")
                          : t("noSizes")}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 hidden md:block">
                    <span className="text-gray-400 text-sm">{product.category.nameEn}</span>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 hidden md:block">
                    <span className="text-brand-400 font-semibold text-sm">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 hidden md:block">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      product.inStock
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {product.inStock ? t("inStock") : t("outOfStock")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 md:col-span-1 flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {deletingId === product.id ? (
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
