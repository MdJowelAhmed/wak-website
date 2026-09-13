import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";

export interface ApiChat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profileImage: string;
  }[];
  unreadCount: number;
  lastMessage?: {
    text: string;
  };
}

export type OfferPaymentMethod = "stripe" | "paychangu";
export type CustomOfferStatus = "pending" | "accepted" | "rejected";

export interface CustomOffer {
  offerId: string;
  title: string;
  description?: string;
  price: number;
  status: CustomOfferStatus;
}

export interface ChatMessage {
  id: number | string;
  sender: "user" | "other";
  text: string;
  time: string;
  avatar: string;
  type?: string;
  attachment?: string;
  customOffer?: CustomOffer;
}

export interface MessagePageBootstrap {
  currentUserId: string;
  selectedChatId: string | null;
  chats: ApiChat[];
  chatHasMore: boolean;
  messages: ChatMessage[];
  messageHasMore: boolean;
}

export function readEntityId(value: unknown): string {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object") {
    const row = value as { _id?: unknown; id?: unknown };
    if (typeof row._id === "string" && row._id) return row._id;
    if (typeof row.id === "string" && row.id) return row.id;
  }
  return "";
}

export function getOtherParticipant(chat: ApiChat, currentUserId: string) {
  const participants = chat.participants || [];
  return participants.find((participant) => participant._id !== currentUserId) || participants[0];
}

export function unwrapSocketMessage(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const row = payload as Record<string, unknown>;
  const nested =
    row.data && typeof row.data === "object" && !("_id" in row)
      ? (row.data as Record<string, unknown>)
      : row.message && typeof row.message === "object" && !("sender" in row && "_id" in row)
        ? (row.message as Record<string, unknown>)
        : row;
  return {
    ...nested,
    chat: nested.chat ?? row.chat ?? nested.chatId ?? row.chatId,
  };
}

export function mapChatMessage(raw: unknown, currentUserId: string): ChatMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as {
    _id?: string;
    id?: string;
    text?: string;
    createdAt?: string;
    type?: string;
    attachment?: string;
    sender?: unknown;
    user?: unknown;
    customOffer?: unknown;
  };

  const id = row._id || row.id;
  if (!id) return null;

  const sender = row.sender ?? row.user;
  const senderId = readEntityId(sender);
  const isUser = Boolean(currentUserId && senderId && senderId === currentUserId);
  const senderImage =
    sender && typeof sender === "object" && "profileImage" in sender
      ? (sender as { profileImage?: string }).profileImage
      : undefined;

  return {
    id,
    sender: isUser ? "user" : "other",
    text: row.text || "",
    time: row.createdAt
      ? new Date(row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
    avatar: senderImage ? resolveImageUrl(senderImage) || "/user.svg" : "/user.svg",
    type: row.type,
    attachment: row.attachment,
    customOffer: mapCustomOffer(row.customOffer),
  };
}

export function appendUniqueMessage(messages: ChatMessage[], next: ChatMessage): ChatMessage[] {
  if (messages.some((message) => message.id === next.id)) return messages;
  return [...messages, next];
}

function readOfferId(row: { offer?: unknown; _id?: string; id?: string }): string {
  if (typeof row.offer === "string" && row.offer) return row.offer;
  if (row.offer && typeof row.offer === "object" && "_id" in row.offer) {
    const nestedId = (row.offer as { _id?: string })._id;
    if (nestedId) return nestedId;
  }
  if (typeof row._id === "string" && row._id) return row._id;
  if (typeof row.id === "string" && row.id) return row.id;
  return "";
}

export function mapCustomOffer(raw: unknown): CustomOffer | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const row = raw as {
    offer?: unknown;
    _id?: string;
    id?: string;
    title?: string;
    description?: string;
    price?: number | string;
    status?: string;
  };

  const offerId = readOfferId(row);
  if (!offerId) return undefined;

  const status: CustomOfferStatus =
    row.status === "accepted" || row.status === "rejected" ? row.status : "pending";

  const price = typeof row.price === "number" ? row.price : Number(row.price);

  return {
    offerId,
    title: row.title || "Custom offer",
    description: row.description,
    price: Number.isFinite(price) ? price : 0,
    status,
  };
}
