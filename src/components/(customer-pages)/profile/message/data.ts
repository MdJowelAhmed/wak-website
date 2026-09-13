import { unstable_cache } from "next/cache";
import { getAccessToken } from "../../../../../helpers/getAccessToken";
import getProfile from "../../../../../helpers/getProfile";
import {
  mapChatMessage,
  readEntityId,
  type ApiChat,
  type ChatMessage,
  type MessagePageBootstrap,
} from "./types";

export const CHAT_PAGE_SIZE = 10;
export const MESSAGE_PAGE_SIZE = 15;

export interface ChatsResult {
  chats: ApiChat[];
  hasMore: boolean;
  page: number;
}

export interface MessagesResult {
  messages: ChatMessage[];
  hasMore: boolean;
  page: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function isApiChat(value: unknown): value is ApiChat {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { _id?: unknown })._id === "string",
  );
}

function readPagination(json: Record<string, unknown> | null) {
  const pagination = asRecord(json?.pagination);
  const page = typeof pagination?.page === "number" ? pagination.page : undefined;
  const totalPage = typeof pagination?.totalPage === "number" ? pagination.totalPage : undefined;
  return { page, totalPage };
}

async function authGetJson(path: string, token: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${process.env.BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json: unknown = await res.json();
  return asRecord(json);
}

function parseChats(json: Record<string, unknown> | null, page: number): ChatsResult {
  const chats = Array.isArray(json?.data) ? json.data.filter(isApiChat) : [];
  const { page: responsePage, totalPage } = readPagination(json);
  const currentPage = responsePage ?? page;
  const hasMore = totalPage !== undefined ? currentPage < totalPage : chats.length === CHAT_PAGE_SIZE;

  return { chats, hasMore, page: currentPage };
}

function parseMessages(
  json: Record<string, unknown> | null,
  currentUserId: string,
  page: number,
): MessagesResult {
  const rows = Array.isArray(json?.data) ? json.data : [];
  const messages = rows
    .map((item) => mapChatMessage(item, currentUserId))
    .filter((item): item is ChatMessage => item !== null)
    .reverse();

  const { page: responsePage, totalPage } = readPagination(json);
  const currentPage = responsePage ?? page;
  const hasMore =
    totalPage !== undefined ? currentPage < totalPage : rows.length === MESSAGE_PAGE_SIZE;

  return { messages, hasMore, page: currentPage };
}

async function fetchChatsPage(
  token: string,
  page: number,
  search: string,
): Promise<ChatsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(CHAT_PAGE_SIZE),
  });
  if (search.trim()) {
    params.set("searchTerm", search.trim());
  }

  const json = await authGetJson(`/chats/mine?${params.toString()}`, token);
  return parseChats(json, page);
}

async function fetchMessagesPage(
  token: string,
  currentUserId: string,
  chatId: string,
  page: number,
): Promise<MessagesResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(MESSAGE_PAGE_SIZE),
  });
  const json = await authGetJson(`/messages/chats/${chatId}?${params.toString()}`, token);
  return parseMessages(json, currentUserId, page);
}

export function getCachedChats(userId: string, token: string, page: number, search: string) {
  const normalizedSearch = search.trim();
  return unstable_cache(
    async () => fetchChatsPage(token, page, normalizedSearch),
    ["chats-mine", userId, String(page), normalizedSearch],
    { revalidate: 3600, tags: [`chats-${userId}`] },
  )();
}

export function getCachedMessages(userId: string, token: string, chatId: string, page: number) {
  return unstable_cache(
    async () => fetchMessagesPage(token, userId, chatId, page),
    ["chat-messages", userId, chatId, String(page)],
    { revalidate: 3600, tags: [`messages-${chatId}`, `chats-${userId}`] },
  )();
}

export async function getMessagePageBootstrap(
  initialChatId?: string,
): Promise<MessagePageBootstrap> {
  const empty: MessagePageBootstrap = {
    currentUserId: "",
    selectedChatId: null,
    chats: [],
    chatHasMore: false,
    messages: [],
    messageHasMore: false,
  };

  const [profile, token] = await Promise.all([getProfile(), getAccessToken()]);
  const currentUserId = readEntityId(profile);
  if (!currentUserId || !token) {
    return { ...empty, currentUserId };
  }

  if (initialChatId) {
    const [chatsResult, messagesResult] = await Promise.all([
      getCachedChats(currentUserId, token, 1, ""),
      getCachedMessages(currentUserId, token, initialChatId, 1),
    ]);

    return {
      currentUserId,
      selectedChatId: initialChatId,
      chats: chatsResult.chats,
      chatHasMore: chatsResult.hasMore,
      messages: messagesResult.messages,
      messageHasMore: messagesResult.hasMore,
    };
  }

  const chatsResult = await getCachedChats(currentUserId, token, 1, "");
  const selectedChatId = chatsResult.chats[0]?._id ?? null;
  const messagesResult = selectedChatId
    ? await getCachedMessages(currentUserId, token, selectedChatId, 1)
    : { messages: [], hasMore: false };

  return {
    currentUserId,
    selectedChatId,
    chats: chatsResult.chats,
    chatHasMore: chatsResult.hasMore,
    messages: messagesResult.messages,
    messageHasMore: messagesResult.hasMore,
  };
}

