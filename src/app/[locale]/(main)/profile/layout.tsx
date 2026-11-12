import { Suspense } from "react";
import ProfileSidebar from "@/components/(customer-pages)/profile/sidebar/ProfileSidebar";
import SidebarSkeleton from "@/components/(customer-pages)/profile/sidebar/SidebarSkeleton";
import { redirect } from "@/i18n/navigation";
import getProfile from "../../../../../helpers/getProfile";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, profile] = await Promise.all([params, getProfile()]);
  if (!profile) {
    redirect({ href: "/", locale });
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Suspense fallback={<SidebarSkeleton />}>
            <ProfileSidebar />
          </Suspense>
        </div>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </section>
  );
}
