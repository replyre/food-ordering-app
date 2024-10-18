"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic"; // Force dynamic rendering for the page

const Page = () => {
  const router = useRouter();
  const { loading, data } = useProfile();
  const [users, setUsers] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && !data?.email) {
      toast.error("You must be logged in to access this page.");
      router.push("/login");
      return;
    }

    if (!loading && data?.email && !data?.admin) {
      toast.error("You are not authorized to view this page.");
    }

    if (!loading && data?.email && data?.admin) {
      fetch("/api/users", { cache: "no-store" }) // Prevent caching
        .then((response) => response.json())
        .then((users) => {
          const filteredUsers = users.filter(
            (user) => user.email !== data.email
          );
          setUsers(filteredUsers);
          setInitialLoad(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setInitialLoad(false);
        });
    } else {
      setInitialLoad(false);
    }
  }, [data?.email, data?.admin, loading, router]);

  if (loading || initialLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (!data?.admin) {
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
    <section className="max-w-2xl mx-auto mt-8 px-4">
      <div className="mt-10">
        <UserTabs isAdmin={true} />
      </div>

      <div className="mt-8">
        {users.length > 0 ? (
          users.map((user) => (
            <Link
              key={user._id}
              href={`/users/${user._id}`}
              className="bg-gray-100 rounded-lg mb-2 p-4 flex items-center gap-4 shadow-md hover:bg-gray-200 transition-colors"
            >
              <div className="flex-grow">
                <div className="text-gray-900 truncate">
                  {user.name || <span className="italic">No name</span>}
                </div>
                <div className="text-gray-500 truncate">{user.email}</div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600">No other users found.</p>
        )}
      </div>
    </section>
  );
};

export default Page;
