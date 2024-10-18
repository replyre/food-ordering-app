"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteButton from "@/components/DeleteButton";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [authLoading, setAuthLoading] = useState(true);
  const [editedCategory, setEditedCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!profileLoading) {
      if (!profileData) {
        toast.error("Please log in to access this page.");
        router.push("/login");
      } else if (!profileData.admin) {
        setAuthLoading(false);
      } else {
        fetchCategories();
        setAuthLoading(false);
      }
    }
  }, [profileLoading, profileData]);

  const fetchCategories = () => {
    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
      });
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }

      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setCategoryName("");
      fetchCategories();
      setEditedCategory(null);

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    toast.promise(creationPromise, {
      loading: editedCategory
        ? "Updating category..."
        : "Creating your new category...",
      success: editedCategory ? "Category updated..." : "Category created...",
      error: "Error, something went wrong!",
    });
  };

  const handleDeleteClick = async (_id) => {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories?_id=" + _id, {
        method: "DELETE",
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    });

    fetchCategories();
  };

  if (profileLoading || authLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader
          size={50}
          color="#3498db"
          loading={profileLoading || authLoading}
        />
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
    <section className="mt-8 max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <UserTabs isAdmin={true} />

      <form
        className="mt-8 bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleCategorySubmit}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-grow w-full">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && (
                <>
                  : <b>{editedCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(ev) => setCategoryName(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter category name"
            />
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-lg shadow-sm hover:bg-primary-dark transition duration-300 w-full sm:w-auto"
            >
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-600 transition duration-300 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Existing Categories
        </h2>
        {categories?.length > 0 ? (
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-lg p-4 shadow-md mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 border border-gray-200"
            >
              <div className="text-gray-700 text-lg font-medium">{c.name}</div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryName(c.name);
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
                  onDelete={() => handleDeleteClick(c._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-600 transition duration-300 w-full sm:w-auto"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No categories found.</p>
        )}
      </div>
    </section>
  );
};

export default Page;
