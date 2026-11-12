"use server";

import { cookies } from "next/headers";
import { readSession, type SessionResult } from "./getProfile";

export async function getSession(): Promise<SessionResult> {
  const session = await readSession();
  if (session.status === "unauthenticated") {
    (await cookies()).delete("accessToken");
  }
  return session;
}
