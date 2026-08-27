export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export const customerSidebar: SidebarItem[] = [
  {
    label: "Personal Information",
    href: "/profile/personal-info",
    icon: "User",
  },
  {
    label: "Order Tracking",
    href: "/profile/order-tracking",
    icon: "FolderKanban",
  },
  {
    label: "Review & Feedback",
    href: "/profile/reviews",
    icon: "Star",
  },
  {
    label: "Setting",
    href: "/profile/settings",
    icon: "Settings",
  },
];

export const serviceSidebar: SidebarItem[] = [
  {
    label: "Personal Information",
    href: "/profile/personal-info",
    icon: "User",
  },
  {
    label: "Product Orders",
    href: "/profile/product-orders",
    icon: "FolderKanban",
  },
  {
    label: "Service Orders",
    href: "/profile/service-orders",
    icon: "Briefcase",
  },
  {
    label: "Message",
    href: "/profile/message",
    icon: "MessageCircle",
  },
  {
    label: "Setting",
    href: "/profile/settings",
    icon: "Settings",
  },
];
