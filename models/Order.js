import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      maxlength: 60,
    },
    customerId: {
      type: String,
      required: true,
      maxlength: 60,
    },
    address: {
      type: Array,
      required: true,
      maxlength: 500,
    },
    products: {
      type: Array,
      required: true,
      maxlength: 500,
    },
    cart_qty: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    method: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
