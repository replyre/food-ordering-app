"use client";

import React, { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import Bars2 from "../icons/Bars2";
import ShoppingCart from "../icons/ShoppingCart";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners"; 

function AuthLinks({ status, userName }) {
  if (status === "authenticated") {
    return (
      <>
        <Link
          className="text-primary font-semibold hover:underline"
          href={"/profile"}
        >
          Hello,{userName}
        </Link>
        <button
          onClick={() => signOut()}
          className="whitespace-nowrap font-bold bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition duration-300"
        >
          Logout
        </button>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Link
          className="bg-primary hover:bg-primary-dark text-white rounded-full px-4 py-2 transition duration-300"
          href={"/login"}
        >
          Login
        </Link>
      </>
    );
  }
}

const Header = () => {
  const { data: session, status } = useSession();
  const userData = session?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16">
        <ClipLoader color="#3498db" loading={true} size={30} /> 
      </div>
    );
  }

  return (
    <header className="bg-white">
      {/* Mobile Header */}
      <div className="flex items-center md:hidden justify-between ">
        <Link
          className="text-primary font-bold text-2xl hover:text-primary-dark transition duration-300"
          href={"/"}
        >
          OvenFresh
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={"/cart"} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-50 rounded-lg mt-2 flex flex-col gap-4 text-center"
        >
          <Link
            href={"/"}
            className="hover:text-primary transition duration-300"
          >
            Home
          </Link>
          <Link
            href={"/menu"}
            className="hover:text-primary transition duration-300"
          >
            Menu
          </Link>
          <Link
            href={"/#about"}
            className="hover:text-primary transition duration-300"
          >
            About
          </Link>
          <Link
            href={"/#contact"}
            className="hover:text-primary transition duration-300"
          >
            Contact
          </Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between ">
        <nav className="flex items-center gap-8 text-gray-600 font-semibold">
          <Link
            className="text-primary font-bold text-3xl hover:text-primary-dark transition duration-300"
            href={"/"}
          >
            OvenFresh
          </Link>
          <Link
            href={"/"}
            className="hover:text-primary transition duration-300"
          >
            Home
          </Link>
          <Link
            href={"/menu"}
            className="hover:text-primary transition duration-300"
          >
            Menu
          </Link>
          <Link
            href={"/#about"}
            className="hover:text-primary transition duration-300"
          >
            About
          </Link>
          <Link
            href={"/#contact"}
            className="hover:text-primary transition duration-300"
          >
            Contact
          </Link>
        </nav>
        <nav className="flex items-center gap-6 text-gray-600 font-semibold">
          <AuthLinks status={status} userName={userName} />
          <Link
            href={"/cart"}
            className="relative hover:text-primary transition duration-300"
          >
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
