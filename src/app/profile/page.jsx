"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        })
        .catch((error) => console.error("Error fetching profile:", error));
    } else if (status === "unauthenticated") {
      toast.error("You need to log in first!");
      router.push("/login");
    }
  }, [status, router]);

  const handleProfileInfoUpdate = async (e, data) => {
    e.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        resolve();
        fetch("/api/profile")
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
            setIsAdmin(data.admin);
          });
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile Saved!",
      error: "Error saving profile",
    });
  };

  if (status === "loading" || !profileFetched) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader
          size={50}
          color="#3948db"
          loading={status === "loading" || !profileFetched}
        />
      </div>
    );
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
};

export default Page;
