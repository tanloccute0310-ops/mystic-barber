import { connectDB } from "../../lib/mongodb";
import Service from "../../models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({});
    return NextResponse.json(services); 
  } catch (error) {
    console.error("Lỗi lấy danh sách dịch vụ:", error);
    return NextResponse.json([], { status: 500 });
  }
}