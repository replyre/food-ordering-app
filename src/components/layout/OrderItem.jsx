"use client";

import React from "react";

const OrderItem = ({ order }) => {

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  console.log(order.cartProducts);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold">Order #{order._id}</h2>
      <p className="text-gray-600">Date: {formattedDate}</p>
      <p className="text-gray-600">Status: {order.status}</p>
      <p className="text-gray-600">
        Total Amount: ₹{order.totalAmount.toFixed(2)}
      </p>

      <h3 className="text-lg font-semibold mt-4">Order Details</h3>
      <ul className="list-disc list-inside mt-2">
        {order.cartProducts.map((product, index) => (
          <li key={index} className="border-b border-gray-300 pb-2 mb-2">
            <p>
              <strong>Product Name:</strong> {product.productName}
            </p>
            <p>
              <strong>Size:</strong> {product.size}
            </p>
            <p>
              <strong>Base Price:</strong> ₹{product.price.toFixed(2)}
            </p>
            {product.extras && product.extras.length > 0 && (
              <p>
                <strong>Extras:</strong> {product.extras.join(", ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItem;
