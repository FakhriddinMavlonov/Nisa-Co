"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, MessageCircle, Share2, ChevronLeft, ChevronRight, Star, Mail } from "lucide-react";
import { Product } from "@/types";
import type { Locale } from "@/types";
import { formatPrice, getLocalizedField, buildWhatsAppUrl, buildWhatsAppMessage, buildEmailBody, DELIVERY_FEE } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/utils";
import { EmailOrderModal } from "@/components/EmailOrderModal";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  locale: string;
}

export function ProductDetailClient({ product, relatedProducts, locale }: ProductDetailClientProps) {
  const t = useTranslations("product");
  const { addItem, setIsOpen } = useCartContext();

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [imageIndex, setImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const name = getLocalizedField(product, "name", locale as Locale);
  const description = getLocalizedField(product, "description", locale as Locale);

  const images = product.images.length > 0 ? product.images : [{ id: "0", url: "", alt: name, order: 0 }];
  const currentImage = images[imageIndex];

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      setIsOpen(true);
    }, 800);
  };

  const handleBuyWhatsApp = () => {
    const message = buildWhatsAppMessage(
      [{ name, size: selectedSize, quantity: 1, price: product.price }],
      product.price,
      product.currency
    );
    const url = buildWhatsAppUrl("+447775777313", message);
    window.open(url, "_blank");
  };

  const emailBody = buildEmailBody(
    [{ name, size: selectedSize, quantity: 1, price: product.price }],
    product.price,
    product.currency
  );

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {currentImage.url ? (
                    <Image
                      src={currentImage.url}
                      alt={currentImage.alt || name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={currentImage.url.startsWith("/")}
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                      <ShoppingBag className="w-20 h-20 text-pink-300" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
                    disabled={imageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImageIndex(Math.min(images.length - 1, imageIndex + 1))}
                    disabled={imageIndex === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                      i === imageIndex ? "border-brand-500 scale-105" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {img.url ? (
                      <Image src={img.url} alt={img.alt || name} width={64} height={64} unoptimized={img.url.startsWith("/")} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-brand-600 font-medium">
              {getLocalizedField(product.category, "name", locale as Locale)}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.8)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-brand-600">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.oldPrice, product.currency)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              + {formatPrice(DELIVERY_FEE)} {t("deliveryFee")}
            </p>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{description}</p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 text-sm">{t("selectSize")}</span>
                  {selectedSize && (
                    <span className="text-brand-600 text-sm font-medium">{selectedSize}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.name === selectedSize ? undefined : size.name)}
                      disabled={size.stock === 0}
                      className={cn(
                        "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                        size.stock === 0 && "opacity-40 cursor-not-allowed line-through",
                        selectedSize === size.name
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      )}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                product.inStock ? "bg-green-500" : "bg-red-400"
              )} />
              <span className={cn(
                "text-sm font-medium",
                product.inStock ? "text-green-700" : "text-red-600"
              )}>
                {product.inStock ? t("inStock") : t("outOfStock")}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all text-sm",
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white",
                  !product.inStock && "opacity-50 cursor-not-allowed"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedToCart ? t("added") : t("addToCart")}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyWhatsApp}
                  className="flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors text-sm shadow-lg shadow-green-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("buyNow")}
                </button>
                <button
                  onClick={() => setEmailModalOpen(true)}
                  className="flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {t("buyEmail")}
                </button>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t("shareProduct")}
            </button>

            {/* Features */}
            <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-3">
              {[
                { icon: "🚚", label: t("free_shipping") },
                { icon: "↩️", label: t("easyReturns") },
                { icon: "🔒", label: t("securePayment") },
                { icon: "✨", label: t("premiumQuality") },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{feat.icon}</span>
                  {feat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <ProductGrid products={relatedProducts} title={t("relatedProducts")} />
          </div>
        )}
      </div>

      <EmailOrderModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        toEmail="Munisadolieva0@gmail.com"
        subject={`Order: ${name}`}
        body={emailBody}
      />
    </div>
  );
}
