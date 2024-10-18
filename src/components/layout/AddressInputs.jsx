import React, { useState } from "react";

const AddressInputs = ({ addressProps, setAddressProp, disabled = false }) => {
  const { phone, streetAddress, postalCode, city, country } = addressProps;

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const input = e.target.value;

    const isNumeric = /^\d*$/.test(input);

    if (isNumeric) {
      setAddressProp("phone", input);
    }

    if (input.length === 10 && !isNumeric) {
      setPhoneError("Phone number can only contain digits (0-9)");
    } else if (input.length > 10) {
      setPhoneError("Phone number must not exceed 10 digits");
    } else if (input.length < 10 && input.length > 0) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          disabled={disabled}
          placeholder="Phone Number"
          value={phone || ""}
          onChange={handlePhoneChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          maxLength={10}
        />
        {phoneError && (
          <p className="text-sm text-red-500 mt-1">{phoneError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          disabled={disabled}
          placeholder="Street Address"
          value={streetAddress || ""}
          onChange={(e) => setAddressProp("streetAddress", e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="Postal Code"
            value={postalCode || ""}
            onChange={(e) => setAddressProp("postalCode", e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="City"
            value={city || ""}
            onChange={(e) => setAddressProp("city", e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          disabled={disabled}
          placeholder="Country"
          value={country || ""}
          onChange={(e) => setAddressProp("country", e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>
    </div>
  );
};

export default AddressInputs;
