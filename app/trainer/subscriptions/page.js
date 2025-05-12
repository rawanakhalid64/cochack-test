import instance from "@/utils/axios";
import { formatDateInterval } from "@/utils/helpers";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

async function subscription() {
  const data = await instance.get("/api/v1/subscriptions");
  const subscriptions = data.data.subscriptions;
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <p>
        no subscritptions yet, keep working on your portfilio to meet your first
        client soon
      </p>
    );
  }

  console.log(subscriptions);
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {subscriptions.map((subs) => {
          return (
            <Link
              key={subs._id}
              href={`/trainer/subscriptions/${subs._id}`}
              className="bg-[#FFA8A7] min-h-24 p-4 rounded-xl flex items-center gap-5 cursor-pointer hover:bg-[#fc8f8d] transition duration-150"
            >
              <div className="bg-gray-200 h-24 w-24 rounded-xl"></div>
              <div className="flex-1 flex flex-col gap-1 text-white">
                <h2 className="font-bold text-lg capitalize">
                  {subs.clientName}
                </h2>
                <p className="">{subs.planTitle}</p>
                <p>
                  {formatDateInterval(
                    new Date(subs.startedAt),
                    new Date(subs.expiresAt)
                  )}
                </p>
              </div>

              <IoIosArrowForward color="white" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default subscription;
