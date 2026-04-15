import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb"; // Lưu ý dùng @/lib/mongodb nếu ../../ bị lỗi
import Booking from "../../models/Booking";
import jwt from "jsonwebtoken";

// HÀM LẤY LỊCH SỬ ĐẶT LỊCH (GET)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // NÂNG CẤP: Dùng req.cookies của NextRequest và quét nhiều tên cookie phổ biến
    const token = req.cookies.get("auth_token")?.value || 
                  req.cookies.get("token")?.value || 
                  req.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json({ message: "Vui lòng đăng nhập" }, { status: 401 });
    }

    // Giải mã token để lấy userId
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // NÂNG CẤP: Phòng hờ hệ thống của bạn lưu id là _id (chuẩn MongoDB)
    const userId = decoded.id || decoded._id;

    // Tìm tất cả hóa đơn thuộc về người này
    const appointments = await Booking.find({ userId: userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ appointments }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy lịch sử:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// HÀM TẠO ĐƠN HÀNG MỚI (POST)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userName, phone, date, time, barber, services, totalPrice, paymentMethod } = body;

    if (!services || services.length === 0) {
      return NextResponse.json({ message: "Giỏ hàng trống!" }, { status: 400 });
    }

    let userId = null;
    try {
      // ĐÃ FIX: Đồng bộ quét đúng auth_token giống hàm GET
      const token = req.cookies.get("auth_token")?.value || 
                    req.cookies.get("token")?.value || 
                    req.cookies.get("jwt")?.value || 
                    req.cookies.get("accessToken")?.value;
      if (token) {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        userId = decoded.id || decoded._id;
      }
    } catch (e) {
      console.log("Khách vãng lai đặt lịch, bỏ qua check token");
    }

    const newBooking = await Booking.create({
      userName,
      phone,
      date,
      time,
      barber,
      services,
      totalPrice,
      paymentMethod: paymentMethod || "store",
      userId: userId // Lúc này userId sẽ được lưu chính xác, không còn bị null nữa
    });

    return NextResponse.json({ message: "Đặt lịch thành công!", booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi lưu lịch hẹn:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}