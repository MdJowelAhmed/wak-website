import "server-only";
import { cache } from "react";
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

type ProfileLookup =
    | { status: "authenticated"; data: Record<string, unknown> }
    | { status: "unauthenticated" }
    | { status: "error" };

/** One `/users/profile` request per server render, shared by the layout and pages. */
const lookupProfile = cache(async (): Promise<ProfileLookup> => {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return { status: "unauthenticated" };

    try {
        const res = await fetch(`${process.env.BASE_URL}/users/profile`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401 || res.status === 403) return { status: "unauthenticated" };
        if (!res.ok) return { status: "error" };

        const json = await res.json();
        const data = json?.data;
        if (!data || typeof data !== "object") return { status: "error" };
        if (data.profileImage) {
            data.profileImage = resolveImageUrl(data.profileImage);
        }
        return { status: "authenticated", data };
    } catch {
        return { status: "error" };
    }
});

export async function readSession(): Promise<SessionResult> {
    const result = await lookupProfile();
    if (result.status !== "authenticated") return result;

    const { name, email, profileImage } = result.data;
    return {
        status: "authenticated",
        user: {
            name: typeof name === "string" ? name : "",
            email: typeof email === "string" ? email : "",
            profileImage: typeof profileImage === "string" && profileImage ? profileImage : null,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers read loosely-typed API fields
const getProfile = cache(async (): Promise<any> => {
    const result = await lookupProfile();
    return result.status === "authenticated" ? result.data : null;
});

export default getProfile;
