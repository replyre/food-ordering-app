"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Right from "@/components/icons/Right";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleOrderNowClick = () => {
    router.push("/menu");
  };

  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Everything
          <br />
          is better
          <br />
          with a&nbsp;
          <span className="text-primary">Pizza</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Pizza is the missing piece that makes every day complete, a simple yet
          delicious joy in life
        </p>
        <div className="flex gap-4 text-sm">
          <button
            onClick={handleOrderNowClick}
            className="justify-center bg-primary uppercase flex items-center gap-2 text-white px-3 py-2 rounded-lg text-xs md:text-sm md:px-4 md:py-2 hover:bg-primary-dark transition-all"
          >
            Order now
            <Right />
          </button>
        </div>
      </div>

      <div className="relative md:block">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <ClipLoader size={50} color={"#3498db"} loading={loading} />
          </div>
        )}
        <Image
          src={"/pizza4.jpg"}
          fill
          objectFit="contain"
          alt={"pizza"}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
    </section>
  );
}
