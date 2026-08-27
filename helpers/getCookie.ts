"use server";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
   const cookieStore = await cookies();
   const cookieValue = cookieStore.get(name)?.value || null;
   return cookieValue;
};