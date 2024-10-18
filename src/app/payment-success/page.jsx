import Link from "next/link";

export default async function PaymentSuccessPage({ searchParams }) {
  const { orderId } = searchParams;

  if (!orderId) {
    return <div className="text-red-500">No order ID provided</div>;
  }

  const deliveryFee = 50;

  let orderDetails;
  let error = null;

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/orders/${orderId}`
    );

    if (!response.ok) {
      throw new Error("Order not found");
    }

    orderDetails = await response.json();
  } catch (err) {
    error = err.message || "Error fetching order details";
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading your order details...</p>
      </div>
    );
  }

  const { cartProducts, totalAmount } = orderDetails;

  return (
    <section className="p-4 md:p-8 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 via-white to-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 text-center mb-4 md:mb-6">
          🎉 Thank you for your order!
        </h1>
        <h2 className="text-lg md:text-xl font-medium text-center mb-4">
          Your OvenFresh order will reach you soon! 🍕
        </h2>
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Order Summary
          </h3>

          {cartProducts.map((product, index) => (
            <div
              key={index}
              className="mb-4 border-b pb-4 md:mb-6 md:pb-6 grid grid-cols-1 md:grid-cols-12 gap-4"
            >
              <div className="md:col-span-4">
                <img
                  src={product.productImage || "/placeholder-image.png"}
                  alt={product.productName}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="md:col-span-8">
                <h4 className="text-lg md:text-xl font-semibold text-gray-800">
                  {product.productName}
                </h4>
                <p className="text-gray-600">
                  Base Price: ₹{product.basePrice}
                </p>
                {product.size && product.size.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-gray-600 font-semibold">Size:</p>
                    <ul className="list-disc pl-5">
                      {product.size.map((s, idx) => (
                        <li key={idx} className="text-gray-600">
                          {s.name} - ₹{s.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600">No size selected</p>
                )}
                {product.extras.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-600 font-semibold">Extras:</p>
                    <ul className="list-disc pl-5">
                      {product.extras.map((extra, idx) => (
                        <li key={idx} className="text-gray-600">
                          {extra.name}: +₹{extra.price}
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


          <div className="mt-4 text-lg font-semibold text-gray-700 text-right">
            <p>Delivery Fee: ₹{deliveryFee}</p>
          </div>


          <div className="mt-2 text-lg font-bold text-gray-700 text-right">
            <p>Total Amount: ₹{totalAmount}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-gray-700">
            Your order ID:{" "}
            <span className="font-bold text-primary">{orderId}</span>
          </p>
          <p className="mt-2 text-gray-600">
            You can check the details in your order history anytime.
          </p>
          <Link
            href="/orders"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
          >
            View Order History
          </Link>
        </div>
      </div>
    </section>
  );
}
