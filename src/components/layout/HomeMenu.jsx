"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((menuItems) => {
        setBestSellers(menuItems.slice(-6));
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto text-center mb-12">
        <SectionHeaders
          subHeader={"Check Out"}
          mainHeader={"Our Best Sellers"}
        />
        <p className="text-gray-500 text-sm md:text-base mt-4">
          Taste the most popular items loved by our customers.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {bestSellers?.length > 0 &&
          bestSellers.map((item) => (
            <div
              key={item._id}
              className="hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg p-4"
            >
              <MenuItem {...item} />
            </div>
          ))}
      </div>
    </section>
  );
}
