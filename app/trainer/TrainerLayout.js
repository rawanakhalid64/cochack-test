"use client";
import TrainerSidebar from "./TrainerSidebar";

export default function TrainerLayout({ children }) {
  return (
    <div className="flex  bg-white dark:bg-[#190527]">
      <TrainerSidebar />
      <div className="ml-64 flex-1 p-8">{children}</div>
    </div>
  );
}
