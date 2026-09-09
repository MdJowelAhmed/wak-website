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
