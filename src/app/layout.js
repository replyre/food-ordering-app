import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/Footer";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "OvenFresh - Delicious Pizzas Delivered to Your Doorstep",
  description:
    "Order from a wide selection of freshly baked pizzas, salads, and desserts at OvenFresh. Customize your meal, track your order, and enjoy quick delivery. Your favorite food is just a few clicks away!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <div className="min-h-screen flex flex-col">
          <AppProvider>
            <Toaster />
            <div className="flex-grow max-w-4xl w-full mx-auto p-4">
              <Header />
              <main>{children}</main>
            </div>
            <Footer className="max-w-4xl w-full mx-auto" />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
