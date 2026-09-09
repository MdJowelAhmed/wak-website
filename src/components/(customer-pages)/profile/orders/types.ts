export interface Order {
  id: string;
  dbId?: string;
  itemId?: string;
  title: string;
  date: string;
  sellerName: string;
  sellerAvatar: string;
  sellerId?: string;
  amount: string;
  status: "In Progress" | "Completed" | "Canceled";
  statusLog?: { status: string; timestamp: string; note: string }[];
}
