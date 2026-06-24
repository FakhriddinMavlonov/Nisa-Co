import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminProductsList } from "@/components/admin/AdminProductsList";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
      sizes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <AdminProductsList products={products as never} />
    </AdminLayout>
  );
}
