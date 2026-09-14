export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export const customerSidebar: SidebarItem[] = [
  {
    label: "personalInfo",
    href: "/profile/personal-info",
    icon: "User",
  },
  {
    label: "orderTracking",
    href: "/profile/order-tracking",
    icon: "FolderKanban",
  },
  {
    label: "reviews",
    href: "/profile/reviews",
    icon: "Star",
  },
  {
    label: "settings",
    href: "/profile/settings",
    icon: "Settings",
  },
];

export const serviceSidebar: SidebarItem[] = [
  {
    label: "personalInfo",
    href: "/profile/personal-info",
    icon: "User",
  },
  {
    label: "productOrders",
    href: "/profile/product-orders",
    icon: "FolderKanban",
  },
  {
    label: "serviceOrders",
    href: "/profile/service-orders",
    icon: "Briefcase",
  },
  {
    label: "message",
    href: "/profile/message",
    icon: "MessageCircle",
  },
  {
    label: "settings",
    href: "/profile/settings",
    icon: "Settings",
  },
];
