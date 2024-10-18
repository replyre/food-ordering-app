"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import Link from "next/link";
import Right from "@/components/icons/Right";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const Page = () => {
  const { loading: profileLoading, data: profileData } = useProfile();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/menu-items?adminId=${profileData?._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const items = await response.json();
        setMenuItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profileData?._id && profileData?.admin) {
      fetchMenuItems();
    } else {
      setLoading(false);
    }
  }, [profileData]);

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

  if (profileLoading || loading) {
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
    <section className="mt-8 max-w-7xl mx-auto px-4">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link className="button flex items-center" href={"/menu-items/new"}>
          <span>Create new menu item</span>
          <Right />
        </Link>
      </div>

      {!loading && menuItems.length === 0 ? (
        <div className="flex justify-center items-center mt-28">
          <div className="text-center">
            <p className="text-gray-500 text-lg font-semibold">
              No menu items found.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Create a new menu item to get started.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg text-gray-700 mt-12 mb-6 font-semibold">
            Edit Menu Items:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item._id}
                href={`/menu-items/edit/${item._id}`}
                className="bg-white border rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 w-full">
                  <Image
                    className="object-cover"
                    src={item.image || "/no-image.jpg"}
                    alt={item.name || "Menu item image"}
                    fill
                    onError={(e) => {
                      e.target.src = "/no-image.jpg";
                    }}
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-md font-medium text-gray-800">
                    {item.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </section>
  );
};

export default Page;
