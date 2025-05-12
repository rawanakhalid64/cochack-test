"use client";

import { useRouter } from "next/navigation";

export default function TabSwitcher({ id, selectedTab }) {
  const router = useRouter();

  const handleTabChange = (tab) => {
    router.push(`/trainer/subscriptions/${id}?tab=${tab}`);
  };

  return (
    <div className="flex items-center bg-[#FFEBE9] border-[1px] border-[#EFBFBB] rounded-full overflow-hidden text-lg">
      <span
        onClick={() => handleTabChange("training")}
        className={`cursor-pointer p-3 px-6 ${
          selectedTab === "training" ? "bg-[#A69ACE] font-semibold" : ""
        }`}
      >
        <img src="/icons/training.png" alt="training" className="h-10" />
      </span>
      <span
        onClick={() => handleTabChange("nutrition")}
        className={`cursor-pointer p-3 px-6 ${
          selectedTab === "nutrition" ? "bg-[#A69ACE] font-semibold" : ""
        }`}
      >
        <img src="/icons/nutrition.png" alt="nutrition" className="h-10" />
      </span>
    </div>
  );
}
