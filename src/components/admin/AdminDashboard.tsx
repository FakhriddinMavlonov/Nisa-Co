"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Tag, Plus, ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface RecentProduct {
  id: string;
  nameEn: string;
  price: number;
  currency: string;
  images: { url: string }[];
  category: { nameEn: string };
  inStock: boolean;
  createdAt: Date;
}

interface AdminDashboardProps {
  productCount: number;
  categoryCount: number;
  recentProducts: RecentProduct[];
}

export function AdminDashboard({ productCount, categoryCount, recentProducts }: AdminDashboardProps) {
  const t = useTranslations("admin");

  const stats = [
    {
      label: t("totalProducts"),
      value: productCount,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/products",
    },
    {
      label: t("totalCategories"),
      value: categoryCount,
      icon: Tag,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/categories",
    },
    {
      label: t("inStock"),
      value: productCount,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("dashboard")}</h1>
          <p className="text-gray-400 text-sm mt-1">{t("welcomeBack")}</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group cursor-pointer">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products/new">
          <div className="bg-brand-900/30 border border-brand-700/30 rounded-2xl p-5 hover:bg-brand-900/50 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600/30 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{t("addNewProduct")}</p>
                <p className="text-gray-400 text-xs">{t("uploadSubtitle")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link href="/admin/categories">
          <div className="bg-purple-900/20 border border-purple-700/20 rounded-2xl p-5 hover:bg-purple-900/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{t("manageCategories")}</p>
                <p className="text-gray-400 text-xs">{t("organizeProducts")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{t("recentProducts")}</h2>
          <Link href="/admin/products" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1">
            {t("viewAll")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>{t("noProductsYet")}</p>
              <Link href="/admin/products/new" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
                {t("addFirstProduct")}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProducts.map((product) => (
                <Link key={product.id} href={`/admin/products/${product.id}/edit`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
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
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.nameEn}</p>
                      <p className="text-gray-500 text-xs">{product.category.nameEn}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-brand-400 font-semibold text-sm">{formatPrice(product.price, product.currency)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {product.inStock ? t("inStock") : t("outOfStock")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
