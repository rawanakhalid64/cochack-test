import Image from "next/image";
import Navbar from "@/components/Navbar/nav";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-b from-gray-50 to-purple-200">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col md:flex-row items-center gap-8 md:space-x-10">
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-[3rem] lg:text-[4rem] font-extrabold text-gray-900 leading-tight md:leading-[110px]">
              Reach your <br />
              perfect body <br />
              shape using <br />
              our platform
            </h1>
            <p className="mt-4 text-gray-700 max-w-md mx-auto md:mx-0">
              Coachak is a platform that will give you the opportunity to choose between joining us as a trainer or being a trainee and reach your goals.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 mt-6 md:mt-0">
            <Image
              src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730715397/victor-freitas-KIzBvHNe7hY-unsplash_1_a9j6cv.webp"
              alt="Lifting weights"
              width={590}
              height={390}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
        </section>

        {/* Why Choosing Us Section */}
        <section className="bg-[#2E0D44] text-white px-4 py-12 md:py-20">
          {/* Section Title */}
          <h1 className="font-poppins font-semibold text-3xl sm:text-4xl lg:text-[52px] text-center mb-12">
            Why Choosing Us?
          </h1>

          {/* Content Container */}
          <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-10 gap-y-8">
            {/* Left Image */}
            <div className="flex-1">
              <Image
                src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730715405/brooke-lark-nTZOILVZuOg-unsplash_1_v2l5em.webp"
                alt="Healthy foods"
                width={590}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>

            {/* Right Text */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-[36px] leading-relaxed">
                We offer a wide variety of sports activities. With your subscription, you will receive a personalized training plan and a tailored nutrition plan designed to help you achieve your goals.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
