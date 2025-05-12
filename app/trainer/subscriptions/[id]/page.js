// app/trainer/subscriptions/[id]/page.tsx
import Calendar from "@/components/Calendar/Calendar";
import TabSwitcher from "@/components/TabSwitcher";
import instance from "@/utils/axios";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

async function Page({ params, searchParams }) {
  const selectedTab = searchParams.tab || "training";

  // Fetch data directly in the server component
  const subscription = await instance
    .get(`/api/v1/subscriptions/${params.id}/weeks`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching subscription:", error);
      return null;
    });

  return (
    <section className="max-w-screen-lg m-auto flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link href={"/trainer/subscriptions"}>
          <IoIosArrowBack className="bg-gray-200 h-14 text-2xl rounded-lg cursor-pointer" />
        </Link>
        {/* Client component for interactive tabs */}
        <TabSwitcher id={params.id} selectedTab={selectedTab} />
      </div>
      <div className=" font-semibold text-3xl">{`${
        selectedTab === "nutrition" ? "Nutrition" : "Training"
      } Plan`}</div>
      {/* Rest of your content */}
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-4">Week 1</div>
      </div>
      <Calendar />
    </section>
  );
}

export default Page;
