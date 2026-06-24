import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!product) return { title: "Product Not Found" };

  const name = getLocalizedField(product, "name", locale as Locale);
  const description = getLocalizedField(product, "description", locale as Locale);
  const seoTitle = getLocalizedField(product, "seoTitle", locale as Locale) || `${name} | Nisa&Co`;
  const seoDesc = getLocalizedField(product, "seoDesc", locale as Locale) || description;
  const image = product.images[0]?.url;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `${siteUrl}/${locale}/products/${product.slug}`,
      languages: {
        en: `${siteUrl}/en/products/${product.slug}`,
        uz: `${siteUrl}/uz/products/${product.slug}`,
        no: `${siteUrl}/no/products/${product.slug}`,
        sv: `${siteUrl}/sv/products/${product.slug}`,
        es: `${siteUrl}/es/products/${product.slug}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: "website",
      images: image ? [{ url: image, alt: name }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      inStock: true,
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
    take: 4,
  });

  const name = getLocalizedField(product, "name", locale as Locale);
  const description = getLocalizedField(product, "description", locale as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: product.images.map((i) => i.url),
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/${locale}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Nisa&Co",
      },
    },
    brand: {
      "@type": "Brand",
      name: "Nisa&Co",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product as never}
        relatedProducts={related as never}
        locale={locale}
      />
    </>
  );
}
