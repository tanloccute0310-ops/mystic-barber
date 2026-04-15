import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Category from '../../../models/Category';
import { revalidatePath } from 'next/cache';

// --- 1. CẬP NHẬT DANH MỤC (PUT) ---
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params; // Lấy ID từ URL
    const { name, description } = await request.json();
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 });
    }

    // Xóa cache để trang User cập nhật ngay lập tức
    revalidatePath('/services');

    return NextResponse.json({ message: 'Cập nhật thành công', category: updatedCategory }, { status: 200 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Tên danh mục đã tồn tại' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 });
  }
}

// --- 2. XÓA DANH MỤC (DELETE) ---
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 });
    }

    // Xóa cache để trang User cập nhật ngay lập tức
    revalidatePath('/services');

    return NextResponse.json({ message: 'Đã xóa danh mục' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 });
  }
}