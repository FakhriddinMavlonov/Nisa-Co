"use client";

import { useTranslations } from "next-intl";

interface AdminSettingsClientProps {
  adminEmail: string;
}

export function AdminSettingsClient({ adminEmail }: AdminSettingsClientProps) {
  const t = useTranslations("admin");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("settings")}</h1>
      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("whatsappNumber")}</label>
            <input
              defaultValue="+447775777313"
              readOnly
              className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm opacity-50 cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">{t("configureInEnv")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("adminEmail")}</label>
            <input
              value={adminEmail}
              readOnly
              className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
