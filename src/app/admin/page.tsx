import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [productCount, categoryCount, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.findMany({
      include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <AdminLayout>
      <AdminDashboard
        productCount={productCount}
        categoryCount={categoryCount}
        recentProducts={recentProducts as never}
      />
    </AdminLayout>
  );
}
