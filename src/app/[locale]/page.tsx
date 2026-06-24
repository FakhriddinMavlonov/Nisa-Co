import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { BannerSection } from "@/components/sections/BannerSection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: t("homeTitle"),
    description: t("siteDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        uz: `${siteUrl}/uz`,
        no: `${siteUrl}/no`,
        sv: `${siteUrl}/sv`,
        es: `${siteUrl}/es`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("siteDescription"),
      url: `${siteUrl}/${locale}`,
      siteName: "Nisa&Co",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("siteDescription"),
    },
  };
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, inStock: true },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    take: 6,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Nisa&Co",
            description: "Premium fashion and lifestyle products",
            url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/${locale}/products?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
            inLanguage: locale,
            availableLanguage: ["en", "uz", "no", "sv", "es"],
          }),
        }}
      />
      <HeroSection />
      <FeaturedSection products={featuredProducts as never} />
      <CategoriesSection categories={categories as never} locale={locale} />
      <BannerSection />
    </>
  );
}
