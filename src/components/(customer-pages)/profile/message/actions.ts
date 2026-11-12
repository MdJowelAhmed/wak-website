"use server";

import { getAccessToken } from "../../../../../helpers/getAccessToken";
import getProfile from "../../../../../helpers/getProfile";
import { revalidateTag } from "next/cache";
import { getCachedChats, getCachedMessages, type ChatsResult, type MessagesResult } from "./data";
import { readEntityId } from "./types";

export async function loadMyChatsAction(page: number, search: string): Promise<ChatsResult> {
  const [profile, token] = await Promise.all([getProfile(), getAccessToken()]);
  const userId = readEntityId(profile);
  if (!userId || !token || page < 1) {
    return { chats: [], hasMore: false, page };
  }

  return getCachedChats(userId, token, page, search);
}

export async function loadChatMessagesAction(
  chatId: string,
  page: number,
): Promise<MessagesResult> {
  const [profile, token] = await Promise.all([getProfile(), getAccessToken()]);
  const userId = readEntityId(profile);
  if (!userId || !token || !chatId || page < 1) {
    return { messages: [], hasMore: false, page };
  }

  return getCachedMessages(userId, token, chatId, page);
}

export async function revalidateMessageCaches(chatId?: string) {
  const profile = await getProfile();
  const userId = readEntityId(profile);
  if (!userId) return;

  revalidateTag(`chats-${userId}`, "max");
  if (typeof chatId === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(chatId)) {
    revalidateTag(`messages-${chatId}`, "max");
  }
}
