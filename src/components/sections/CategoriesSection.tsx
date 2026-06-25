"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  image?: string | null;
  _count: { products: number };
}

interface CategoriesSectionProps {
  categories: Category[];
  locale: string;
}

const CATEGORY_COLORS = [
  "from-pink-100 to-rose-200",
  "from-amber-100 to-yellow-200",
  "from-purple-100 to-violet-200",
  "from-blue-100 to-sky-200",
  "from-emerald-100 to-green-200",
  "from-orange-100 to-amber-200",
];

export function CategoriesSection({ categories, locale }: CategoriesSectionProps) {
  const t = useTranslations("categories");

  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-600 font-medium text-sm uppercase tracking-widest mb-2">
            ✦ {t("subtitle")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const name = getLocalizedField(category, "name", locale as Locale);
            const colorClass = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} h-36 md:h-48 flex flex-col items-center justify-center cursor-pointer group shadow-sm`}
                  >
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={name}
                        fill
                        className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                      />
                    )}

                    <div className="relative z-10 text-center px-4">
                      <h3 className="font-serif text-lg md:text-xl font-bold text-gray-800 mb-1">
                        {name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {category._count.products} {t("items")}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("viewAll")} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
