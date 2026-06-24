import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string; featured?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: t("productsTitle"),
    description: t("siteDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/products`,
      languages: {
        en: `${siteUrl}/en/products`,
        uz: `${siteUrl}/uz/products`,
        no: `${siteUrl}/no/products`,
        sv: `${siteUrl}/sv/products`,
        es: `${siteUrl}/es/products`,
      },
    },
    openGraph: {
      title: t("productsTitle"),
      description: t("siteDescription"),
      type: "website",
    },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, search, featured } = await searchParams;

  const where: Record<string, unknown> = {};
  if (category) where.category = { slug: category };
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { nameEn: { contains: search } },
      { nameUz: { contains: search } },
      { nameNo: { contains: search } },
      { nameSv: { contains: search } },
      { nameEs: { contains: search } },
    ];
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <ProductsPageClient
      products={products as never}
      categories={categories as never}
      locale={locale}
      initialSearch={search}
      initialCategory={category}
    />
  );
}
