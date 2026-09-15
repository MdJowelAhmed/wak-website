"use server";

import { cookies } from "next/headers";
import { resolveImageUrl } from "./resolveImageUrl";

const getProfile = async () => {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) {
        return null;
    }

    try {
        const res = await fetch(`${process.env?.BASE_URL}/users/profile`, {
            cache: "no-store",
            next: {
                tags: ["user-profile"],
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return null;
        }

        const json = await res.json();
        const data = json?.data;
        if (data?.profileImage) {
            data.profileImage = resolveImageUrl(data.profileImage);
        }
        return data ?? null;
    } catch {
        return null;
    }
};

export default getProfile;
