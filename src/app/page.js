"use client";
import HeroSection from "@/components/layout/HeroSection";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroSection />

      {loading ? (
        <div className="flex justify-center items-center w-full h-full py-12">
          <ClipLoader size={50} color={"#3948db"} loading={loading} />
        </div>
      ) : (
        <HomeMenu />
      )}

      {/* About Us Section */}
      <section className="my-16 py-12 bg-white" id="about">
        <div className="text-center">
          <SectionHeaders subHeader={"Our Story "} mainHeader={"About Us"} />
        </div>
        <div className="text-gray-600 max-w-3xl mx-auto mt-8 flex flex-col gap-6 px-6 md:px-0">
          <p className="text-lg leading-relaxed">
            At <span className="text-primary font-semibold">OvenFresh</span>, we
            believe that food isn't just about sustenance, it’s about joy. Our
            story begins with a passion for bringing freshly baked, handcrafted
            pizzas right to your table.
          </p>
          <p className="text-lg leading-relaxed">
            From our signature pizzas, made with carefully sourced ingredients,
            to our love for providing exceptional service, we strive to make
            every meal a memorable experience. Whether you're dining with
            family, friends, or ordering from the comfort of your home,
            OvenFresh is here to make your day better, one slice at a time.
          </p>
          <p className="text-lg leading-relaxed">
            We’re more than just a pizza shop; we’re part of your community,
            delivering not just great food, but a sense of connection with every
            order.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="my-16 py-12 bg-white text-center" id="contact">
        <SectionHeaders
          subHeader={"Don't hesitate"}
          mainHeader={"Contact us"}
        />
        <div className="mt-8">
          <p className="text-gray-600 mb-4 text-lg">
            We're always here to answer your questions or assist with any
            orders.
          </p>
          <a
            className="text-3xl md:text-4xl text-primary font-semibold underline hover:text-primary-dark transition-colors duration-300"
            href="tel:+91 9510488269"
          >
            +91 454545xxxx
          </a>
        </div>
      </section>
    </>
  );
}
