"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Left from "@/components/icons/Left";
import { useRouter, useParams } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";
import DeleteButton from "@/components/DeleteButton";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = useProfile();

  useEffect(() => {
    if (data?._id && id) {
      fetch(`/api/menu-items?id=${id}`)
        .then((res) => res.json())
        .then((items) => {
          if (Array.isArray(items) && items.length > 0) {
            const item = items.find((item) => item._id === id);
            if (
              item &&
              String(item.createdBy).trim() === String(data._id).trim()
            ) {
              setMenuItem(item);
            } else {
              setRedirectToItems(true);
            }
          } else {
            setRedirectToItems(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching menu item:", error);
          setRedirectToItems(true); 
        });
    }
  }, [id, data?._id]);

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      _id: id,
      createdBy: menuItem?.createdBy,
    };

    try {
      const response = await fetch("/api/menu-items", {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to save menu item");
      await toast.promise(response.json(), {
        loading: "Saving this tasty item...",
        success: "Saved successfully!",
        error: "Error saving item.",
      });
      setRedirectToItems(true);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  async function handleDeleteClick() {
    try {
      const res = await fetch(`/api/menu-items?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId: data._id }),
      });
      if (!res.ok) throw new Error("Failed to delete menu item");
      await toast.promise(res.json(), {
        loading: "Deleting...",
        success: "Deleted successfully!",
        error: "Error deleting item.",
      });
      setRedirectToItems(true);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  }

  useEffect(() => {
    if (redirectToItems) {
      router.push("/menu-items");
    }
  }, [redirectToItems, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader size={50} color="#3948db" loading={true} />
      </div>
    );
  }

  if (!data?.admin) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <section className="mt-8 px-4">
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
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        {menuItem ? (
          <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
        ) : (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#3948db" loading={true} />
          </div>
        )}
      </div>
      <div className="max-w-md mx-auto mt-4">
        <DeleteButton
          label="Delete this menu item"
          onDelete={handleDeleteClick}
          className="bg-red-600 text-white hover:bg-red-700 transition"
        />
      </div>
    </section>
  );
};

export default Page;
