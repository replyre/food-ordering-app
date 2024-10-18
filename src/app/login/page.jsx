"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

const page = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);

  const handleGoogleLogin = async () => {
    setLoginInProgress(true);

    try {
      const res = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (res.ok) {
        console.log("Login successful");
      } else {
        throw new Error("Failed to log in");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <section className="mt-16">
      <header className="w-full flex items-center justify-center pt-8">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to OvenFresh!
        </h1>
      </header>
      <div className="flex flex-grow items-center justify-center mt-5">
        <div className="bg-white shadow-md rounded-lg p-10 max-w-md w-full text-center">
          <p className="text-gray-600 mb-6">
            Sign in to order delicious pizzas!
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-primary text-white rounded-full py-4 px-4 font-semibold transition-colors shadow-md"
            disabled={loginInProgress}
            aria-label="Sign in with Google"
            aria-disabled={loginInProgress}
          >
            <Image
              src={"/google.png"}
              alt="Google logo"
              width={24}
              height={24}
            />
            <span className="ml-3">Sign in with Google</span>
          </button>
          {loginInProgress && (
            <div className="mt-4 text-center">
              <p>Logging in...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
