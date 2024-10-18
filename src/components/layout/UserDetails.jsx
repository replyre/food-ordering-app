import React from "react";

const UserDetails = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
      <div className="flex items-center mb-6">
        <img
          src={user.image || "/default-profile.png"} // Add default image if none exists
          alt={`${user.name}'s profile`}
          className="w-20 h-20 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {user.name || "No name"}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <strong className="block font-medium text-gray-700">Phone:</strong>
          <p className="text-gray-900">{user.phone || "No phone number"}</p>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">
            Street Address:
          </strong>
          <p className="text-gray-900">{user.streetAddress || "No address"}</p>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">
            Postal Code:
          </strong>
          <p className="text-gray-900">{user.postalCode || "No postal code"}</p>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">City:</strong>
          <p className="text-gray-900">{user.city || "No city"}</p>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">Country:</strong>
          <p className="text-gray-900">{user.country || "No country"}</p>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">Admin:</strong>
          <p
            className={`text-gray-900 ${
              user.admin ? "text-green-600" : "text-red-600"
            }`}
          >
            {user.admin ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
