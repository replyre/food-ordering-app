"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CartContext } from "@/components/AppContext";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [address, setAddress] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); 
  const { clearCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("checkoutData");

    if (!storedData) {
      router.push("/cart");
      return;
    }

    try {
      const { cartProducts, address, total } = JSON.parse(storedData);
      setCartProducts(cartProducts);
      setAddress(address);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error parsing checkoutData:", error);
      router.push("/cart");
    }
  }, [router]);

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\s/g, "").slice(0, 16);
    return cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 ").toUpperCase();
  };

  const formatExpiryDate = (value) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, 4);
    return cleanedValue.replace(/(\d{2})(?=\d)/g, "$1/").slice(0, 7);
  };

  const formatCvv = (value) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const validatePaymentDetails = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please fill in all fields.");
      return false;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Card number must be 16 digits.");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      toast.error("Invalid expiry date format.");
      return false;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const fullYear = currentYear - (currentYear % 100) + yearNum;

    if (monthNum < 1 || monthNum > 12) {
      toast.error("Month must be between 01 and 12.");
      return false;
    }

    if (fullYear < currentYear || fullYear > currentYear + 5) {
      toast.error("Year must be within the next 5 years.");
      return false;
    }

    if (fullYear === currentYear && monthNum < currentMonth) {
      toast.error("Expiry date cannot be in the past.");
      return false;
    }

    if (cvv.length !== 3) {
      toast.error("CVV must be 3 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePaymentDetails()) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/saveOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartProducts,
          address,
          totalAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { orderId } = data;

        toast.success("Payment Successful!");

        clearCart();

        sessionStorage.removeItem("checkoutData");

        router.push(`/payment-success?orderId=${orderId}`);
      } else {
        throw new Error("Failed to save order.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Something went wrong with the payment. Please try again.");
      setIsProcessing(false); 
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Paying <span className="text-primary">₹{totalAmount}</span> to{" "}
        <span className="text-primary">OvenFresh</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700"
          >
            Expiry Date (MM/YY)
          </label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-gray-700"
          >
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(formatCvv(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md w-full ${
            isProcessing ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isProcessing} 
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </section>
  );
}
