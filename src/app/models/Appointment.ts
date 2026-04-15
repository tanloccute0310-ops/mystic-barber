import mongoose, { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    barber: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: { 
      type: String, 
      default: "Pending",
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"] 
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // Liên kết với bảng User
  required: true
},
  },
  { timestamps: true }
);

const Appointment = models.Appointment || model("Appointment", AppointmentSchema);
export default Appointment;