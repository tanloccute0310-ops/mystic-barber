import React from 'react';
import Link from 'next/link';
import { connectDB } from '../../lib/mongodb';
import Booking from '../../models/Booking';
import { revalidatePath } from 'next/cache';

async function getAllBookings() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Lỗi lấy danh sách lịch đặt:", error);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  // --- LỚP BẢO VỆ SỐ 2: BACKEND LOGIC (SERVER ACTION) ---
  async function updateStatus(formData: FormData) {
    'use server';
    const id = formData.get('bookingId') as string;
    const newStatus = formData.get('status') as string;

    try {
      await connectDB();
      const existingBooking = await Booking.findById(id);
      
      if (!existingBooking) {
        console.error("Không tìm thấy đơn hàng.");
        return;
      }

      const oldStatus = existingBooking.status;

      // LUẬT 1: Đơn đã Đóng (Hoàn thành / Hủy) thì cấm sửa
      if (oldStatus === 'Completed' || oldStatus === 'Cancelled') {
        console.error("Cảnh báo bảo mật: Cố tình đổi trạng thái đơn hàng đã đóng!");
        return; 
      }

      // LUẬT 2: Cấm đi lùi từ Đã xác nhận về Chờ xác nhận
      if (oldStatus === 'Confirmed' && newStatus === 'Pending') {
        console.error("Lỗi logic: Không thể lùi về Chờ xác nhận.");
        return;
      }

      // Vượt qua bảo vệ -> Cập nhật Database
      await Booking.findByIdAndUpdate(id, { status: newStatus });
      revalidatePath('/admin'); // Tùy chỉnh lại đường dẫn nếu cần
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  }

  // Map tiếng Anh sang Tiếng Việt & Màu sắc
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Confirmed': return { text: 'Đã xác nhận', color: 'bg-primary' };
      case 'Completed': return { text: 'Hoàn thành', color: 'bg-success' };
      case 'Cancelled': return { text: 'Đã hủy', color: 'bg-danger' };
      case 'Pending': 
      default: return { text: 'Chờ xác nhận', color: 'bg-warning text-dark' }; 
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* SIDEBAR */}
      <div className="bg-dark p-4 shadow-lg border-end border-secondary" style={{ width: '280px' }}>
        <h3 className="text-warning fw-bold mb-5 border-bottom border-secondary pb-3">
          <i className="bi bi-scissors me-2"></i>MYSTIC ADMIN
        </h3>
        <ul className="nav flex-column gap-3">
          <li className="nav-item">
            <Link href="/admin" className="nav-link text-light hover-warning px-3 py-2">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/Admin_Booking" className="nav-link text-dark bg-warning rounded fw-bold px-3 py-2">
              <i className="bi bi-calendar-check me-2"></i> Quản lý Lịch Đặt
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/Admin_Service" className="nav-link text-light hover-warning px-3 py-2">
              <i className="bi bi-list-stars me-2"></i> Quản lý Dịch Vụ
            </Link>
          </li>
            <li className="nav-item">
                <Link href="/admin/Admin_Categories" className="nav-link text-light hover-warning px-3 py-2">
              Quản lý Danh mục
            </Link>
        </li>
          <li className="nav-item mt-5">
            <Link href="/" className="nav-link text-secondary px-3 py-2">
              <i className="bi bi-box-arrow-left me-2"></i> Về trang khách
            </Link>
          </li>
      
        </ul>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="flex-grow-1 p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">QUẢN LÝ LỊCH ĐẶT</h2>
          <span className="badge bg-secondary fs-6">Tổng cộng: {bookings.length} đơn</span>
        </div>

        <div className="card bg-dark border-secondary shadow-lg">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle text-center">
                <thead className="table-active border-secondary">
                  <tr className="text-warning">
                    <th className="py-3">Khách hàng</th>
                    <th className="py-3">SĐT</th>
                    <th className="py-3">Lịch hẹn</th>
                    <th className="py-3">Tổng tiền</th>
                    <th className="py-3">Trạng thái</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: 'none' }}>
                  {bookings.map((bk: any) => {
                    const display = getStatusDisplay(bk.status);
                    
                    // --- LỚP BẢO VỆ SỐ 1: FRONTEND UI LOCK ---
                    // Đơn hàng đã Hoàn Thành hoặc Đã Hủy sẽ bị khóa (isLocked = true)
                    const isLocked = bk.status === 'Completed' || bk.status === 'Cancelled';

                    return (
                      <tr key={bk._id}>
                        <td className="fw-bold text-start ps-4">
                          {bk.userName}
                          <br/><span className="text-secondary small fw-normal">#{bk._id.substring(0, 5)}</span>
                        </td>
                        <td>{bk.phone}</td>
                        <td>
                          <div className="d-flex flex-column align-items-center">
                            <span className="badge bg-secondary mb-1">{bk.date}</span>
                            <span className="text-warning fw-bold">{bk.time}</span>
                          </div>
                        </td>
                        <td className="fw-bold">{bk.totalPrice.toLocaleString('vi-VN')}K</td>
                        
                        {/* Cột Trạng thái */}
                        <td>
                          <span className={`badge ${display.color} px-3 py-2 rounded-pill`}>
                            {display.text}
                          </span>
                        </td>

                        {/* Cột Thao tác */}
                        <td>
                          <form action={updateStatus} className="d-flex justify-content-center gap-2">
                            <input type="hidden" name="bookingId" value={bk._id} />
                            
                            {/* Dropdown thông minh tự động ẩn/hiện Option */}
                            <select 
                              name="status" 
                              className="form-select form-select-sm bg-dark text-light border-secondary"
                              style={{ width: '140px' }}
                              defaultValue={bk.status || 'Pending'}
                              disabled={isLocked} // Khóa cứng nếu đã đóng
                            >
                              {bk.status === 'Pending' && <option value="Pending">Chờ xác nhận</option>}
                              {(bk.status === 'Pending' || bk.status === 'Confirmed') && <option value="Confirmed">Đã xác nhận</option>}
                              {(bk.status === 'Confirmed' || bk.status === 'Completed') && <option value="Completed">Hoàn thành</option>}
                              <option value="Cancelled">Đã hủy</option>
                            </select>
                            
                            {/* Nút LƯU chỉ hiện khi Form chưa bị khóa */}
                            {!isLocked && (
                              <button type="submit" className="btn btn-sm btn-outline-warning fw-bold">
                                LƯU
                              </button>
                            )}
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary fs-5">
                        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                        Chưa có lịch đặt nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        select:disabled { background-color: #333 !important; color: #888 !important; cursor: not-allowed; }
      `}} />
    </div>
  );
}