"use client";
import { CartContext } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProfile } from "@/components/useProfile";
import { cartProductPrice } from "@/components/AppContext";
import { FaShoppingCart } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(true);
  const deliveryFee = 50;

  useEffect(() => {
    if (profileData && cartProducts.length > 0) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
    setLoading(false);
  }, [profileData, cartProducts]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (
      !address.phone ||
      !address.streetAddress ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }

    const validCartProducts = cartProducts.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.image,
      basePrice: product.basePrice,
      size: product.size,
      extras: product.extras,
    }));

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "checkoutData",
          JSON.stringify({
            address,
            cartProducts: validCartProducts,
            total: subtotal + deliveryFee,
          })
        );
      }
      window.location.href = "/payment";
    } catch (error) {
      toast.error("Failed to store checkout data.");
    }
  }

  function handleRemove(index) {
    removeCartProduct(index);
  }

 
  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color="#3498db" />
        <p className="ml-4 text-gray-700">Fetching user details...</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Your Cart" />
      </div>

      {cartProducts.length > 0 ? (
        <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden">
            {cartProducts.map((product, index) => (
              <CartProduct
                key={index}
                product={product}
                onRemove={() => handleRemove(index)}
              />
            ))}
            <div className="py-2 pr-4 md:pr-16 flex justify-end items-center">
              <div className="text-gray-500 text-sm md:text-base">
                Subtotal:
                <br />
                Delivery:
                <br />
                Total:
              </div>
              <div className="font-semibold pl-2 text-right text-sm md:text-base">
                ₹{subtotal}
                <br />₹{deliveryFee}
                <br />₹{subtotal + deliveryFee}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Checkout</h2>
            <form onSubmit={proceedToCheckout}>
              <AddressInputs
                addressProps={address}
                setAddressProp={handleAddressChange}
              />

              <button
                type="submit"
                disabled={!profileData || !cartProducts.length}
                className={`p-2 rounded mt-4 w-full ${
                  profileData && cartProducts.length > 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Pay ₹{subtotal + deliveryFee}
              </button>

              {!profileData && (
                <p className="text-red-500 text-sm font-semibold mt-2">
                  You must be logged in to order food.
                </p>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-12">
          <FaShoppingCart size={60} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-500">
            No items in the cart
          </h2>
        </div>
      )}
    </section>
  );
}
