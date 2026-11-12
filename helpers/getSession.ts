"use server";

import { cookies } from "next/headers";
import { resolveImageUrl } from "./resolveImageUrl";

export interface SessionUser {
  name: string;
  email: string;
  profileImage: string | null;
}

export type SessionResult =
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" }
  | { status: "error" };

export async function getSession(): Promise<SessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return { status: "unauthenticated" };

  try {
    const res = await fetch(`${process.env.BASE_URL}/users/profile`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      cookieStore.delete("accessToken");
      return { status: "unauthenticated" };
    }
    if (!res.ok) return { status: "error" };

    const json = await res.json();
    const data = json?.data;
    if (!data) return { status: "error" };

    return {
      status: "authenticated",
      user: {
        name: typeof data.name === "string" ? data.name : "",
        email: typeof data.email === "string" ? data.email : "",
        profileImage: data.profileImage ? resolveImageUrl(data.profileImage) : null,
      },
    };
  } catch {
    return { status: "error" };
  }
}
