"use client";

import React, { useState, useEffect } from "react";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { ClipLoader } from "react-spinners";

export const dynamic = "force-dynamic"; // Force dynamic rendering for the page

const page = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, menuItemsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/menu"),
      ]);

      if (!categoriesRes.ok || !menuItemsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [categories, menuItems] = await Promise.all([
        categoriesRes.json(),
        menuItemsRes.json(),
      ]);

      setCategories(categories);
      setMenuItems(menuItems);
    } catch (error) {
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader size={50} color="#3948db" loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">{error}</div>;
  }

  return (
    <section className="mt-8">
      {categories?.length > 0 &&
        categories.map((c) => (
          <div key={c._id}>
            <SectionHeaders mainHeader={c.name} />
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
              {menuItems
                .filter((item) => item.category === c._id)
                .map((item) => (
                  <MenuItem key={item._id} {...item} />
                ))}
            </div>
          </div>
        ))}
    </section>
  );
};

export default page;
