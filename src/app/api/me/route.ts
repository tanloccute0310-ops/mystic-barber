import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../lib/mongodb';
import User from '../../models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // 1. Giải mã token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // DEBUG: Lộc nhìn vào Terminal (Vscode) xem nó in ra gì nhé
    console.log("Dữ liệu trong Token:", decoded);

    await connectDB();

    // 2. Lấy ID (Dùng decoded.id để khớp với file login/route.ts)
    const userId = decoded.id || decoded.userId; 

    const user = await User.findById(userId).select('-password');

    if (!user) {
      console.log("Không tìm thấy User trong DB với ID:", userId);
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Lỗi xác thực Token:", (error as Error).message);
    return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { name, phone } = await request.json();

    await connectDB();
    
    // Thống nhất dùng decoded.id
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id || decoded.userId,
      { name, phone },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}