import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const currentPath = request.nextUrl.pathname;

  // 1. Định nghĩa các nhóm Route
  const isAdminRoute = currentPath.startsWith('/admin');
  const isUserProtectedRoute = ['/booking', '/profile', '/booking-history'].some(route => currentPath.startsWith(route));
  const isAuthRoute = ['/login', '/register'].some(route => currentPath.startsWith(route));

  // --- TRƯỜNG HỢP 1: BẢO VỆ TRANG ADMIN ---
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?message=AdminOnly', request.url));
    }
    try {
      // Giải mã token bằng jose để check Role
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'mystic_barber_secret');
      const { payload }: any = await jwtVerify(token, secret);

      if (payload.role !== 'admin') {
        // Có token nhưng không phải Admin -> Đuổi về trang chủ
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // Token lỗi hoặc hết hạn
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // --- TRƯỜNG HỢP 2: BẢO VỆ TRANG USER (Booking, Profile) ---
  if (isUserProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('message', 'Vui lòng đăng nhập để tiếp tục!');
    return NextResponse.redirect(url);
  }
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};