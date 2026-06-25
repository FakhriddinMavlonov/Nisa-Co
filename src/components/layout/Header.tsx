"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, ChevronDown } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "uz", label: "O'zbek", flag: "🇺🇿", short: "UZ" },
  { code: "no", label: "Norsk", flag: "🇳🇴", short: "NO" },
  { code: "sv", label: "Svenska", flag: "🇸🇪", short: "SV" },
  { code: "es", label: "Español", flag: "🇪🇸", short: "ES" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, isOpen, setIsOpen } = useCartContext();

  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("shop") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-gold-100"
            : "bg-white/85 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo_nisaco.png"
                alt="Nisa&Co logo"
                width={40}
                height={48}
                className="object-contain"
                priority
              />
              <Image
                src="/logo_nisaco_word.png"
                alt="Nisa&Co"
                width={110}
                height={36}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all relative group",
                    pathname === link.href
                      ? "text-gold-600 bg-gold-50"
                      : "text-gray-700 hover:text-gold-600 hover:bg-gold-50"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-colors"
                aria-label={t("search")}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language switcher — always visible on all screen sizes */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={cn(
                    "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl border transition-all",
                    langOpen
                      ? "border-gold-400 bg-gold-50 text-gold-700"
                      : "border-gold-200 hover:border-gold-400 hover:bg-gold-50 text-gray-700"
                  )}
                >
                  <span className="text-base sm:text-lg leading-none">
                    {currentLocale.flag}
                  </span>
                  <span className="hidden sm:block text-xs font-semibold">
                    {currentLocale.short}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-gold-600 transition-transform duration-200",
                      langOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[152px] z-50"
                    >
                      {LOCALES.map((loc) => (
                        <button
                          key={loc.code}
                          onClick={() => {
                            router.replace(pathname, { locale: loc.code });
                            setLangOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                            locale === loc.code
                              ? "bg-gold-50 text-gold-700 font-semibold"
                              : "text-gray-700 hover:bg-gold-50 hover:text-gold-700"
                          )}
                        >
                          <span className="text-base">{loc.flag}</span>
                          <span>{loc.label}</span>
                          {locale === loc.code && (
                            <span className="ml-auto text-gold-500 text-xs font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-colors"
                aria-label={t("cart")}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gold-100 bg-white/96"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("search") + "..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-gold-50 border border-gold-200 rounded-full text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
