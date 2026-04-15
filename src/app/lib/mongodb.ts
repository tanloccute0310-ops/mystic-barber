import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Vui lòng định nghĩa biến MONGODB_URI trong file .env");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error);
  }
};