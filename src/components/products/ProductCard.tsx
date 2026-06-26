"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import type { Locale } from "@/types";
import { formatPrice, getLocalizedField, cn } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const { addItem } = useCartContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const name = getLocalizedField(product, "name", locale);
  const primaryImage = product.images[imageIndex]?.url;
  const secondaryImage = product.images[1]?.url;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={primaryImage.startsWith("/")}
              className={cn(
                "object-cover transition-all duration-700",
                "group-hover:scale-105",
                secondaryImage && "group-hover:opacity-0"
              )}
              onMouseEnter={() => secondaryImage && setImageIndex(1)}
              onMouseLeave={() => setImageIndex(0)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-pink-300" />
            </div>
          )}

          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={secondaryImage.startsWith("/")}
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
            {product.featured && !product.oldPrice && (
              <span className="bg-gold-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                ✦ {tCommon("new")}
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={cn(
                "w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-colors",
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:text-red-500"
              )}
            >
              <Heart
                className={cn("w-4 h-4", isWishlisted && "fill-white")}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Quick Add Button */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickAdd}
                className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl text-sm font-semibold hover:bg-brand-600 hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {t("addToCart")}
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-brand-600 font-bold">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-gray-400 text-xs line-through">
                  {formatPrice(product.oldPrice, product.currency)}
                </span>
              )}
            </div>
            {product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span
                    key={size.id}
                    className="text-[10px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-500"
                  >
                    {size.name}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-[10px] text-gray-400">
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
