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

export interface ChatMessage {
  id: number | string;
  sender: "user" | "other";
  text: string;
  time: string;
  avatar: string;
  type?: string;
  attachment?: string;
  customOffer?: any;
}
