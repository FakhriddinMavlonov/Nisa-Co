import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { nameEn: "asc" },
  });

  return (
    <AdminLayout>
      <AdminCategoriesClient categories={categories as never} />
    </AdminLayout>
  );
}
