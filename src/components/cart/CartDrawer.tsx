"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";
import { formatPrice, buildWhatsAppUrl, buildWhatsAppMessage, getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const { items, removeItem, updateQuantity, total } = useCartContext();

  const handleWhatsApp = () => {
    const waItems = items.map((item) => ({
      name: getLocalizedField(item.product, "name", locale),
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const message = buildWhatsAppMessage(waItems, total, "GBP");
    const phone = process.env.NEXT_PUBLIC_WHATSAPP || "+998976125860";
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <h2 className="font-serif text-xl font-semibold">{t("title")}</h2>
                {items.length > 0 && (
                  <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium mb-1">{t("empty")}</p>
                  <p className="text-gray-400 text-sm">{t("emptySubtext")}</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-colors"
                  >
                    {t("continueShopping")}
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => {
                    const name = getLocalizedField(item.product, "name", locale);
                    const image = item.product.images[0]?.url;
                    return (
                      <motion.div
                        key={`${item.product.id}-${item.selectedSize}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {image ? (
                            <Image
                              src={image}
                              alt={name}
                              width={80}
                              height={96}
                              unoptimized={image.startsWith("/")}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-2">
                            {name}
                          </p>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Size: {item.selectedSize}
                            </p>
                          )}
                          <p className="text-brand-600 font-semibold text-sm mt-1">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.quantity - 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-brand-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-brand-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.selectedSize)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("total")}</span>
                  <span className="font-bold text-xl text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-200"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {t("checkout")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
