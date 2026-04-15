import { connectDB } from "../../lib/mongodb";
import Service from "../../models/Service";
import { NextResponse } from "next/server";
const sampleServices = [
  { name: "Classic Cut (Cắt Cổ Điển)", description: "Tư vấn, cắt xả, sấy tạo kiểu với sáp cao cấp", price: 150, category: "haircut" },
  { name: "Modern Fade", description: "Cắt hiệu ứng Fade mờ dần sắc nét, cạo viền tỉ mỉ", price: 180, category: "haircut" },
  { name: "Kid's Cut (Cắt Trẻ Em)", description: "Dành cho các tiểu quý ông dưới 12 tuổi", price: 100, category: "haircut" },
  { name: "Hot Towel Shave", description: "Cạo râu truyền thống: Chườm khăn nóng, bọt cạo mềm", price: 100, category: "shave" },
  { name: "Beard Trim (Tỉa Râu)", description: "Cắt tỉa form râu gọn gàng, cạo viền sắc cạnh", price: 80, category: "shave" },
  { name: "The Gentleman Combo", description: "Cắt tóc + Cạo khăn nóng + Gội đầu massage", price: 300, category: "combo" }
];

export async function GET() {
  try {
    await connectDB();
    await Service.deleteMany({}); 
    await Service.insertMany(sampleServices); 

    return NextResponse.json({ message: "Tuyệt vời! Đã bơm dữ liệu vào MongoDB thành công." });
  } catch (error) {
    console.error("Lỗi khi seed data:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}