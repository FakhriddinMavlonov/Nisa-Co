"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/types";
import type { Locale } from "@/types";
import { ProductGrid } from "./ProductGrid";
import { getLocalizedField } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  _count: { products: number };
}

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
  locale: string;
  initialSearch?: string;
  initialCategory?: string;
}

export function ProductsPageClient({
  products,
  categories,
  locale,
  initialSearch,
  initialCategory,
}: ProductsPageClientProps) {
  const t = useTranslations("search");
  const tShop = useTranslations("shop");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const name = getLocalizedField(p, "name", locale as Locale).toLowerCase();
        return name.includes(q) || p.nameEn.toLowerCase().includes(q);
      });
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category.slug === selectedCategory);
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, selectedCategory, sortBy, locale]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const productCountLabel = filteredProducts.length === 1
    ? `${filteredProducts.length} ${tShop("productSingular")}`
    : `${filteredProducts.length} ${tShop("productPlural")}`;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2"
          >
            {tShop("title")}
          </motion.h1>
          <p className="text-gray-500">{productCountLabel}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter bar */}
        <div className="flex gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-brand-400 shadow-sm transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{tShop("filters")}</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-brand-400 shadow-sm cursor-pointer"
          >
            <option value="newest">{tShop("sortNewest")}</option>
            <option value="price-asc">{tShop("sortPriceLow")}</option>
            <option value="price-desc">{tShop("sortPriceHigh")}</option>
          </select>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  {tShop("categoriesLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      !selectedCategory
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tShop("all")}
                  </button>
                  {categories.map((cat) => {
                    const name = getLocalizedField(cat, "name", locale as Locale);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-brand-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {name} ({cat._count.products})
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg mb-2">{t("noResults")} &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(""); }}
              className="text-brand-600 hover:text-brand-700 font-medium text-sm"
            >
              {tCommon("tryAgain")}
            </button>
          </motion.div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
