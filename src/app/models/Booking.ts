import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    barber: { type: String, required: true },
    services: [{
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, default: "store" },
    status: { type: String, default: "Pending" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: false
    },
  },
  { timestamps: true }
);

const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking;