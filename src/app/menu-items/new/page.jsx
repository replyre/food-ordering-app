"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Left from "@/components/icons/Left";
import { redirect, useRouter } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading: profileLoading, data: profileData } = useProfile();
  const router = useRouter();

  console.log("Profile data:", profileData);

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    const menuItemData = {
      ...formData,
      createdBy: profileData._id, 
    };

    console.log("menuItemData", menuItemData);

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuItemData),
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving this item... ",
      success: "Saved successfully!",
      error: "Error saving item.",
    });

    setRedirectToItems(true);
  };

  useEffect(() => {
    if (!profileLoading) {
      if (!profileData) {
        toast.error("Please log in to access this page.");
        router.push("/login");
      } else if (!profileData?.admin) {
        toast.error("You are not authorized to access this page.");
      }
    }
  }, [profileLoading, profileData, router]);

  if (redirectToItems) {
    return redirect("/menu-items");
  }

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader size={50} color="#3948db" loading={true} />
      </div>
    );
  }

  if (!profileData?.admin) {
    return (
      <div className="flex flex-col items-center justify-center mt-36">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-600 mt-4">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />

      <div className="max-w-2xl mx-auto mt-8">
        <Link
          href={"/menu-items"}
          className="button flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg">
        <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
      </div>
    </section>
  );
};

export default Page;
