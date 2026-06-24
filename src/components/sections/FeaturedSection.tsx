"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface FeaturedSectionProps {
  products: Product[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const t = useTranslations("featured");

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-brand-600 font-medium text-sm uppercase tracking-widest mb-2">
            ✦ {t("subtitle")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/products">
            <button className="hidden md:flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors group">
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      <ProductGrid products={products} />

      <div className="mt-8 text-center md:hidden">
        <Link href="/products">
          <button className="px-8 py-3 border-2 border-brand-500 text-brand-600 font-semibold rounded-full hover:bg-brand-50 transition-colors">
            {t("viewAll")}
          </button>
        </Link>
      </div>
    </section>
  );
}
