"use server";

import { getAccessToken } from "../../../../../helpers/getAccessToken";
import getProfile from "../../../../../helpers/getProfile";
import { revalidateTags } from "../../../../../helpers/revalidateTags";
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
  const tags: string[] = [];

  if (userId) tags.push(`chats-${userId}`);
  if (chatId) tags.push(`messages-${chatId}`);
  if (tags.length === 0) return;

  await revalidateTags(tags);
}
