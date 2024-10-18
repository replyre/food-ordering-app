import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    address: {
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    cartProducts: [
      {
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        basePrice: { type: Number, required: true },
        size: [
          {
            name: String,
            price: Number,
          },
        ],
        extras: [
          {
            name: String,
            price: Number,
          },
        ],
        productPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
