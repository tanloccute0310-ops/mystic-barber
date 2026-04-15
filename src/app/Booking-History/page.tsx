'use client';
import React, { useEffect, useState } from 'react';

export default function BookingHistoryPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (res.ok) setAppointments(data.data || data.appointments);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 1. Lọc lịch hẹn sắp tới (Pending & Confirmed)
  const upcoming = appointments.filter((item: any) => 
    item.status === 'pending' || item.status === 'confirmed'
  );

  // 2. Lọc lịch sử dịch vụ đã sử dụng (Completed)
  const history = appointments.filter((item: any) => item.status === 'completed');

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <h2 className="fw-bold mb-4" style={{ color: '#B8860B' }}>QUẢN LÝ LỊCH HẸN</h2>

      <ul className="nav nav-tabs mb-4 border-secondary" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active text-light fw-bold" id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming" type="button">
            Lịch sắp tới ({upcoming.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link text-light fw-bold" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button">
            Dịch vụ đã dùng ({history.length})
          </button>
        </li>
      </ul>

      <div className="tab-content text-light" id="myTabContent">
        {/* TAB 1: LỊCH SẮP TỚI */}
        <div className="tab-pane fade show active" id="upcoming" role="tabpanel">
           {renderTable(upcoming, true)}
        </div>

        {/* TAB 2: LỊCH SỬ DỊCH VỤ */}
        <div className="tab-pane fade" id="history" role="tabpanel">
           {renderTable(history, false)}
        </div>
      </div>
    </div>
  );

  // Hàm phụ để vẽ bảng (tránh lặp lại code)
  function renderTable(data: any[], isUpcoming: boolean) {
    if (loading) return <p className="text-center py-5">Đang tải...</p>;
    if (data.length === 0) return <p className="text-center py-5 text-secondary">Không có dữ liệu.</p>;

    return (
      <div className="table-responsive bg-dark p-3 rounded shadow">
        <table className="table table-dark table-hover border-secondary align-middle">
          <thead>
            <tr>
              <th style={{ color: '#B8860B' }}>Dịch vụ</th>
              <th>Barber</th>
              <th>Ngày & Giờ</th>
              <th>Trạng thái</th>
              {isUpcoming && <th className="text-end">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td className="fw-bold">{item.service}</td>
                <td>{item.barber}</td>
                <td>{item.date} | {item.time}</td>
                <td>
                  <span className={`badge ${item.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
                {isUpcoming && (
                  <td className="text-end">
                    {item.status === 'pending' && <button className="btn btn-sm btn-outline-danger">Hủy</button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}