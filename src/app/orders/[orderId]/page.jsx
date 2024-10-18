"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

export default function OrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deliveryFee = 50;

  useEffect(() => {
    async function fetchOrderDetails() {
      if (params?.orderId) {
        try {
          const response = await fetch(`/api/orders/${params.orderId}`);
          if (response.ok) {
            const orderData = await response.json();
            setOrder(orderData);
          } else {
            setError("Failed to load order details");
          }
        } catch (err) {
          setError("Error fetching order details");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Order ID is missing");
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [params?.orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-12">
        <ClipLoader size={50} color="#3948db" loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="p-8 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-primary mb-6">Order Details</h1>

        {order ? (
          <>
            <div className="mb-6 border-b border-gray-300 pb-4">
              <p className="text-sm text-gray-600">
                <strong className="font-semibold">Order ID:</strong> {order._id}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-semibold">Email:</strong>{" "}
                {order.userEmail}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-semibold">Order Date:</strong>{" "}
                {format(new Date(order.createdAt), "PPPpp")}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-semibold">Address:</strong>{" "}
                {order.address.streetAddress}, {order.address.city},{" "}
                {order.address.postalCode}, {order.address.country}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-semibold">Status:</strong>{" "}
                {order.status}
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Ordered Items
            </h2>
            <div className="grid gap-4">
              {order.cartProducts.map((product, index) => (
                <div
                  key={index}
                  className="border rounded-lg bg-gray-50 p-4 shadow-md"
                >
                  <img
                    src={product.productImage || "/placeholder-image.png"}
                    alt={product.productName}
                    className="w-full h-33 object-cover rounded-lg mb-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600">
                      Base Price: ₹{product.basePrice}
                    </p>
                    {product.size && product.size.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-600 font-semibold">Size:</p>
                        <ul className="list-disc pl-5">
                          {product.size.map((s, idx) => (
                            <li key={idx} className="text-gray-600">
                              {s.name}: ₹{s.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.extras && product.extras.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-600 font-semibold">Extras:</p>
                        <ul className="list-disc pl-5">
                          {product.extras.map((extra, idx) => (
                            <li key={idx} className="text-gray-600">
                              {extra.name}: ₹{extra.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-lg font-semibold mt-2">
                      Total Price: ₹{product.productPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-lg font-semibold text-gray-700 text-right">
              <p>Delivery Fee: ₹{deliveryFee}</p>
            </div>

            <p className="text-lg font-semibold mt-6 text-right text-gray-700">
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>

            <div className="mt-8 text-center">
              <Link
                href="/orders"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
              >
                Back to Order History
              </Link>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-gray-600 text-lg">No order details available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
