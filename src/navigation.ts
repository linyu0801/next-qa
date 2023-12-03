import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "zh"] as const;
export const localePrefix = "never"; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
