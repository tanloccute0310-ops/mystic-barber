import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '../../lib/mongodb'; 
import User from '../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // 1. Kiểm tra đầu vào
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' }, 
        { status: 400 }
      );
    }

    // 2. Tìm User và lôi mật khẩu ra (vì select: false trong Model)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' }, 
        { status: 401 }
      );
    }

    // 3. So sánh mật khẩu băm
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' }, 
        { status: 401 }
      );
    }

    // 4. Kiểm tra biến môi trường JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("LỖI: Chưa cấu hình JWT_SECRET trong file .env");
      return NextResponse.json({ error: 'Lỗi cấu hình hệ thống' }, { status: 500 });
    }

    // 5. Tạo Token (Gói cả ID và Role vào để Middleware kiểm tra)
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      jwtSecret, 
      { expiresIn: '7d' } // Token có hiệu lực 7 ngày
    );

    // 6. Thiết lập Cookie bảo mật
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true, // Quan trọng: Ngăn chặn XSS (JS không thể đọc được token)
      secure: process.env.NODE_ENV === 'production', // Chỉ dùng HTTPS khi chạy thực tế
      sameSite: 'strict', // Chống tấn công CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 ngày tính bằng giây
      path: '/',
    });

    // 7. Trả về thông tin cần thiết cho Frontend điều hướng
    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role 
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau!' }, 
      { status: 500 }
    );
  }
}