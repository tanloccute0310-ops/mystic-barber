import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên danh mục"],
      trim: true,
      unique: true, 
    },
    description: {
      type: String,
      trim: true,
      default: "", // Có thể để trống
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tránh lỗi "Cannot overwrite model once compiled" trong Next.js
const Category = models.Category || model("Category", CategorySchema);

export default Category;