import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', '', {
      path: '/',
      expires: new Date(0),
      maxAge: 0,
    });
    
    return NextResponse.json({ message: 'Đăng xuất thành công' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi đăng xuất' }, { status: 500 });
  }
}