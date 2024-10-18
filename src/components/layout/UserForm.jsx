import React, { useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import AddressInputs from "./AddressInputs";

const UserForm = ({ user, onSave }) => {
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [admin, setAdmin] = useState(user?.admin || false);

  const handleAddressChange = (propName, value) => {
    if (propName === "phone") setPhone(value);
    if (propName === "streetAddress") setStreetAddress(value);
    if (propName === "postalCode") setPostalCode(value);
    if (propName === "city") setCity(value);
    if (propName === "country") setCountry(value);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <form
        className="space-y-6"
        onSubmit={(e) =>
          onSave(e, {
            name: userName,
            image,
            phone,
            admin,
            streetAddress,
            city,
            country,
            postalCode,
          })
        }
      >
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <EditableImage link={image} setLink={setImage} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Full Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            disabled={true}
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
            value={user?.email}
            placeholder="Email"
          />
        </div>

        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />

        <div className="flex items-center gap-2 p-4 bg-blue-100 border-2 border-blue-300 rounded-lg shadow-md">
          <input
            id="adminCb"
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            className="text-sm font-semibold text-gray-800"
            htmlFor="adminCb"
          >
            Enable admin access to manage items and dishes.
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition duration-300 disabled:bg-gray-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default UserForm;
