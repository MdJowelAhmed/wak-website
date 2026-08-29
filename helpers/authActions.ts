"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const removeAccessToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  try {
    revalidateTag("user-profile", "max");
  } catch {
    // Ignore cache error if tag doesn't exist
  }
};

export const setAccessToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
    sameSite: "lax",
    httpOnly: false,
  });
  try {
    revalidateTag("user-profile", "max");
  } catch {
    // Ignore cache error if tag doesn't exist
  }
};
