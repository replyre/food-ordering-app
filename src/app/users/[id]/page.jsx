"use client";

import React, { useEffect, useState } from "react";
import UserDetails from "@/components/layout/UserDetails";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/useProfile";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export const dynamic = "force-dynamic"; // Force dynamic rendering for the page

const Page = () => {
  const { loading, data } = useProfile();
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/profile?_id=${id}`, { cache: "no-store" }) // Prevent caching
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
          setInitialLoad(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          toast.error("Failed to load user data.");
          setInitialLoad(false);
        });
    }
  }, [id]);

  if (loading || initialLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (!data?.admin && id !== data?._id) {
    return "You do not have permission to view this page.";
  }

  return (
    <section className="max-w-2xl mx-auto mt-8 px-4">
      <div className="mt-10">
        <UserTabs isAdmin={data?.admin} />
      </div>

      <div className="mt-8">
        {user ? <UserDetails user={user} /> : <p>Loading user details...</p>}
      </div>
    </section>
  );
};

export default Page;
