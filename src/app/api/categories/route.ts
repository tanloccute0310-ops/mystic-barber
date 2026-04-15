import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Category from '../../models/Category';

// --- 1. LẤY DANH SÁCH DANH MỤC (GET) ---
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 }); // Mới nhất lên đầu
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải danh mục' }, { status: 500 });
  }
}

// --- 2. THÊM DANH MỤC MỚI (POST) ---
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Tên danh mục là bắt buộc' }, { status: 400 });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return NextResponse.json({ message: 'Thêm danh mục thành công', category: newCategory }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) { // Lỗi trùng lặp từ MongoDB
        return NextResponse.json({ error: 'Tên danh mục đã tồn tại' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Lỗi máy chủ khi thêm' }, { status: 500 });
  }
}