import { Suspense } from "react";
import ProfileSidebar from "@/components/(customer-pages)/profile/sidebar/ProfileSidebar";
import SidebarSkeleton from "@/components/(customer-pages)/profile/sidebar/SidebarSkeleton";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar — col-span-3 */}
        <div className="lg:col-span-3">
          <Suspense fallback={<SidebarSkeleton />}>
            <ProfileSidebar />
          </Suspense>
        </div>

        {/* Main Content — col-span-9 */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </section>
  );
}
