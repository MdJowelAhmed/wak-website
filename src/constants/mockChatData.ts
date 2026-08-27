// src/constants/mockChatData.ts

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  avatar: string;
}

export const mockCurrentUser: User = {
  id: "user_me",
  name: "Ziad AbouItaif",
  avatar: "https://i.pravatar.cc/150?img=68",
};

export const mockChatRooms: ChatRoom[] = [
  {
    id: "room_1",
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=68",
    lastMessage: "I have uploaded the initial wirefra...",
    time: "10:00 AM",
  },
  {
    id: "room_2",
    name: "Alex Rivers",
    avatar: "https://i.pravatar.cc/150?img=68",
    lastMessage: "I have uploaded the initial wirefra...",
    time: "11:15 AM",
  },
  {
    id: "room_3",
    name: "Emma Watson",
    avatar: "https://i.pravatar.cc/150?img=68",
    lastMessage: "I have uploaded the initial wirefra...",
    time: "02:30 PM",
  },
];

export const mockGroupRooms: ChatRoom[] = [];

export const mockMessages: Record<string, ChatMessage[]> = {
  room_1: [
    {
      id: "msg_101",
      senderId: "sarah_chen",
      text: "Hi there! I've started working on the initial wireframes for the homepage. I'll share them by EOD tomorrow. Does that work for you?",
      time: "10:00 AM",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    {
      id: "msg_102",
      senderId: "user_me",
      text: "Sounds great, Sarah! Please focus on the mobile responsiveness first as we discussed.",
      time: "10:00 AM",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
  ],
  room_2: [
    {
      id: "msg_201",
      senderId: "alex_rivers",
      text: "Hey Alex, I'm reviewing the pull request right now. Looking clean!",
      time: "11:15 AM",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
  ],
  room_3: [
    {
      id: "msg_301",
      senderId: "emma_watson",
      text: "Hello Emma, the brand assets and color palettes have been finalized.",
      time: "02:30 PM",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
  ],
};
