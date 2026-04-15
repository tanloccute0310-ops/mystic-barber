import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
    },
    image: { type: String, default: '/images/default-service.jpg' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Service = models.Service || model("Service", ServiceSchema);
export default Service;