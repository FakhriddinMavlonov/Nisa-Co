import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        sizes: true,
        category: true,
      },
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <AdminLayout>
      <ProductForm product={product as never} categories={categories as never} />
    </AdminLayout>
  );
}
