"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

export function BannerSection() {
  const t = useTranslations("whatsapp");

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-10 md:p-16 text-white text-center"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-12 h-12 text-gold-300" />
            </motion.div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t("readyTitle")}
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
              {t("readyDesc")}
            </p>

            <motion.a
              href="https://wa.me/998976125860"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-2xl shadow-xl shadow-black/20 transition-colors text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              {t("button")}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
