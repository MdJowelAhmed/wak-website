"use server";

import { revalidateTag } from "next/cache";
import { normalizeShoppingCountryCode } from "./regions";

export const revalidateTags = async (tags: string[]) => {
  tags.forEach((tag) => {
    revalidateTag(tag, "max");
  });
};

export async function revalidateHeroSection(countryCode: string) {
  const code = normalizeShoppingCountryCode(countryCode);
  revalidateTag(`hero-section-${code}`, "max");
  revalidateTag(`products-best-selling-${code}`, "max");
  revalidateTag(`products-${code}`, "max");
}