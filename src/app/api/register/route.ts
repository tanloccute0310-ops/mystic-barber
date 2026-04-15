import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!' }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự!' }, 
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã được sử dụng!' }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    return NextResponse.json({
      message: 'Đăng ký thành công!',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    }, { status: 201 });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return NextResponse.json({ error: 'Lỗi server khi đăng ký' }, { status: 500 });
  }
}