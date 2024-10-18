"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/useProfile";
import { format } from "date-fns";
import UserTabs from "@/components/layout/UserTabs";
import { ClipLoader } from "react-spinners"; 

export default function OrdersPage() {
  const { data: profileData, loading: profileLoading } = useProfile();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profileData) {

      console.log("Profile Data", profileData.admin);
      setIsAdmin(profileData?.admin);
      async function fetchOrders() {
        try {
          const response = await fetch("/api/orders");
          if (response.ok) {
            const orderData = await response.json();
            setOrders(orderData);
          } else {
            console.error("Failed to fetch orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false); 
        }
      }

      fetchOrders();
    }
  }, [profileData]);

  if (profileLoading || loading) {
    return (
      <div className="flex justify-center items-center w-full h-full py-12">
        <ClipLoader
          size={50}
          color="#3948db"
          loading={loading || profileLoading}
        />
      </div>
    );
  }

  return (
    <section className="p-8 mt-4">
      
      <UserTabs isAdmin={isAdmin} />

      <h1 className="text-2xl font-semibold mb-6 mt-8">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:bg-gray-200 hover:shadow-md cursor-pointer transition duration-300"
              onClick={() => router.push(`/orders/${order._id}`)}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong>Order Date:</strong>{" "}
                  {format(new Date(order.createdAt), "PPPpp")}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[40vh]">
          <p className="text-gray-600 text-lg">You have no orders yet.</p>
        </div>
      )}
    </section>
  );
}
