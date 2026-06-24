import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });

  return (
    <AdminLayout>
      <ProductForm categories={categories as never} />
    </AdminLayout>
  );
}
