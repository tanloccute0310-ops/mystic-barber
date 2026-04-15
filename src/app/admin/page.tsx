import React from 'react';
import Link from 'next/link';
import { connectDB } from '../lib/mongodb';
import Booking from '../models/Booking';
import RevenueChart from './RevenueChart'; // <-- IMPORT BIỂU ĐỒ VÀO ĐÂY

export const dynamic = 'force-dynamic';

async function getDashboardMetrics() {
  try {
    await connectDB();
    
    // 1. Các thẻ thống kê (Như cũ)
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const recentBookings = await Booking.find().sort({ _id: -1 }).limit(5).lean();

    // 2. LOGIC MỚI: TÍNH DOANH THU THEO TỪNG NGÀY CHO BIỂU ĐỒ
    const chartDataResult = await Booking.aggregate([
      { $match: { status: 'Completed' } }, // Chỉ lấy đơn hoàn thành
      { 
        $group: { 
          _id: "$date", // Nhóm theo cột ngày (date)
          revenue: { $sum: "$totalPrice" } // Cộng dồn tiền
        } 
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày cũ -> mới
      { $limit: 7 } // Chỉ lấy 7 ngày gần nhất
    ]);

    // Format lại dữ liệu cho Recharts dễ đọc
    const chartData = chartDataResult.map(item => ({
      date: item._id, // Ví dụ: "2026-03-17"
      revenue: item.revenue
    }));

    return {
      totalBookings, totalRevenue, completedBookings, 
      recentBookings: JSON.parse(JSON.stringify(recentBookings)),
      chartData // Trả về dữ liệu biểu đồ
    };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Admin:", error);
    return { totalBookings: 0, totalRevenue: 0, completedBookings: 0, recentBookings: [], chartData: [] };
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Confirmed': return <span className="badge bg-primary">Đã xác nhận</span>;
    case 'Completed': return <span className="badge bg-success">Hoàn thành</span>;
    case 'Cancelled': return <span className="badge bg-danger">Đã hủy</span>;
    case 'Pending': 
    default: return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
  }
};

export default async function AdminDashboard() {
  const { totalBookings, totalRevenue, completedBookings, recentBookings, chartData } = await getDashboardMetrics();

  return (
    <div className="d-flex" style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* SIDEBAR */}
      <div className="bg-dark p-4 shadow-lg border-end border-secondary" style={{ width: '280px' }}>
        <h3 className="text-warning fw-bold mb-5 border-bottom border-secondary pb-3 text-uppercase text-center">
          Mystic Admin
        </h3>
        <ul className="nav flex-column gap-3">
          <li className="nav-item">
            <Link href="/admin" className="nav-link text-dark bg-warning rounded fw-bold px-3 py-2">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/Admin_Booking" className="nav-link text-light hover-warning px-3 py-2">
               Quản lý Lịch Đặt
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/Admin_Service" className="nav-link text-light hover-warning px-3 py-2">
               Quản lý Dịch Vụ
            </Link>
          </li>
          <li className="nav-item">
          <Link href="/admin/Admin_Categories" className="nav-link text-light hover-warning px-3 py-2">
            Quản lý Danh mục
          </Link>
        </li>
          <li className="nav-item mt-5">
            <Link href="/" className="nav-link text-secondary px-3 py-2">
               Về trang khách
            </Link>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-5">
        <h2 className="fw-bold mb-4 text-warning">TỔNG QUAN KINH DOANH</h2>

        {/* CÁC THẺ SỐ LIỆU */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card bg-dark border-secondary shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #B8860B' }}>
              <div className="card-body">
                <h6 className="text-secondary fw-bold">TỔNG DOANH THU</h6>
                <h2 className="text-warning fw-bold mt-2 mb-0">
                  {totalRevenue.toLocaleString('vi-VN')} VND
                </h2>
                <small className="text-muted fst-italic">Chỉ tính đơn đã hoàn thành</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-dark border-secondary shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #0dcaf0' }}>
              <div className="card-body">
                <h6 className="text-secondary fw-bold">TỔNG ĐƠN ĐẶT LỊCH</h6>
                <h2 className="text-info fw-bold mt-2 mb-0">
                  {totalBookings} <span className="fs-5 text-secondary fw-normal">đơn</span>
                </h2>
                <small className="text-muted fst-italic">Bao gồm tất cả trạng thái</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-dark border-secondary shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #198754' }}>
              <div className="card-body">
                <h6 className="text-secondary fw-bold">ĐƠN ĐÃ HOÀN THÀNH</h6>
                <h2 className="text-success fw-bold mt-2 mb-0">
                  {completedBookings} <span className="fs-5 text-secondary fw-normal">đơn</span>
                </h2>
                <small className="text-muted fst-italic">Đã cắt tóc & thu tiền</small>
              </div>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC CHỨA BIỂU ĐỒ VÀ BẢNG DỮ LIỆU --- */}
        <div className="row g-4">
          
          {/* CỘT TRÁI: BIỂU ĐỒ (Chiếm 7 phần) */}
          <div className="col-xl-7">
             {/* Gọi Component Biểu đồ và truyền dữ liệu vào */}
             <RevenueChart data={chartData} />
          </div>

          {/* CỘT PHẢI: BẢNG ĐƠN HÀNG MỚI NHẤT (Chiếm 5 phần) */}
          <div className="col-xl-5">
            <div className="card bg-dark border-secondary shadow-sm mt-4 h-100">
              <div className="card-header border-secondary bg-transparent py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-light">Đơn mới cập nhật</h5>
                <Link href="/admin/Admin_Booking" className="btn btn-sm btn-outline-warning fw-bold">
                  Xem tất cả
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0 align-middle">
                    <thead className="table-active">
                      <tr className="text-secondary border-secondary small">
                        <th className="py-3 px-3">Khách hàng</th>
                        <th className="py-3">Thời gian</th>
                        <th className="py-3 text-end px-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: 'none' }}>
                      {recentBookings.length > 0 ? (
                        recentBookings.map((bk: any, idx: number) => (
                          <tr key={idx} className="border-secondary border-opacity-25">
                            <td className="px-3">
                              <div className="fw-bold text-light">{bk.userName}</div>
                              <div className="small text-info">{bk.totalPrice.toLocaleString('vi-VN')}K</div>
                            </td>
                            <td>
                              <div className="small text-secondary">{bk.date}</div>
                              <div className="fw-bold text-warning small">{bk.time}</div>
                            </td>
                            <td className="text-end px-3">
                              {getStatusBadge(bk.status)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-5 text-secondary">
                            Chưa có dữ liệu đặt lịch nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}