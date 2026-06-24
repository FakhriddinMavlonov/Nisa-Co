import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uz", "no", "sv", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});
