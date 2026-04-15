import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Link from "next/link";
import Navbar from "../components/navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystic Barber",
  description: "Trải nghiệm cắt tóc nam chuẩn Châu Âu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        
      <Navbar/>
        {children}
        <footer className="mystic-nav text-light py-5 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 mb-4 mb-lg-0">
                <h5 className="mystic-brand mb-3">MYSTIC BARBER</h5>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                  Không gian cắt tóc nam cổ điển kết hợp hiện đại. Nơi tôn vinh vẻ đẹp nam tính và phong cách quý ông đích thực.
                </p>
                <div className="d-flex gap-3 mt-4">
                  <Link href="#" className="mystic-link m-0">
                    FB
                  </Link>
                  <Link href="#" className="mystic-link m-0">
                    IG
                  </Link>
                  <Link href="#" className="mystic-link m-0">
                    TK
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 mb-4 mb-lg-0">
                <h5 className="text-white mb-3" style={{ color: '#B8860B' }}>LIÊN KẾT</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link href="/" className="text-secondary text-decoration-none hover-gold">Trang Chủ</Link></li>
                  <li className="mb-2"><Link href="/services" className="text-secondary text-decoration-none hover-gold">Bảng Giá Dịch Vụ</Link></li>
                  <li className="mb-2"><Link href="/barbers" className="text-secondary text-decoration-none hover-gold">Đội Ngũ Thợ Cắt</Link></li>
                </ul>
              </div>

              
              <div className="col-lg-4">
                <h5 className="text-white mb-3" style={{ color: '#B8860B' }}>LIÊN HỆ</h5>
                <ul className="list-unstyled text-secondary" style={{ fontSize: '0.9rem' }}>
                  <li className="mb-2">123 Đường Nam Kỳ Khởi Nghĩa, Q.3, TP.HCM</li>
                  <li className="mb-2">0909 123 456</li>
                  <li className="mb-2">booking@mysticbarber.com</li>
                  <li className="mt-3 text-warning">Giờ mở cửa: 9:00 AM - 8:00 PM</li>
                </ul>
              </div>

            </div>
            
            {/* Dòng bản quyền dưới cùng */}
            <div className="border-top border-secondary mt-4 pt-3 text-center text-secondary" style={{ fontSize: '0.8rem' }}>
              &copy; {new Date().getFullYear()} Mystic Barber. Thiết kế phục vụ Đồ án môn học.
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}