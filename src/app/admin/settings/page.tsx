import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">WhatsApp Number</label>
              <input
                defaultValue="+998976125860"
                readOnly
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm opacity-50 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">Configure in .env.local file</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Admin Email</label>
              <input
                value={session.user?.email || ""}
                readOnly
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
