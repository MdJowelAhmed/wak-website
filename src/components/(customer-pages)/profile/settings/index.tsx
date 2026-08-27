"use client";

import { useState } from "react";
import DashboardCard from "../../../../shared/DashboardCard";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccount from "./DeleteAccount";

type SettingsTab = "password" | "delete";

const tabs: { key: SettingsTab; label: string }[] = [
  { key: "password", label: "Change Password" },
  { key: "delete", label: "Delete Account" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("password");

  return (
    <DashboardCard>
      <div className="flex items-center gap-6 border-b border-zinc-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              pb-3 text-base transition-colors cursor-pointer
              ${activeTab === tab.key
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-zinc-500 hover:text-zinc-800 font-semibold"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "password" ? <ChangePasswordForm /> : <DeleteAccount />}
    </DashboardCard>
  );
}
