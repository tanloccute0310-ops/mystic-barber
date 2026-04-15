'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, aptRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/bookings', { cache: 'no-store' })
        ]);

        if (userRes.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (aptRes.ok) {
          const aptData = await aptRes.json();
          setAppointments(aptData.appointments || []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/me', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, phone: user.phone }), 
      });
      if (res.ok) { 
        setMessage('Cập nhật hồ sơ thành công!'); 
        setTimeout(() => setMessage(''), 3000); 
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  const handleRebook = () => {
    router.push(`/services`);
  };

  // --- ĐÃ FIX: MỞ RỘNG BỘ LỌC TÌM KIẾM TRẠNG THÁI ---
  const upcoming = appointments?.filter((item) => 
    ['Pending', 'Confirmed', 'Chờ xác nhận', 'Đã xác nhận'].includes(item.status)
  ) || [];
  
  const history = appointments?.filter((item) => 
    ['Completed', 'Hoàn thành'].includes(item.status)
  ) || [];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', color: '#B8860B' }}>
        <div className="spinner-border me-2"></div>
        <span className="fw-bold">ĐANG TẢI HỒ SƠ MYSTIC...</span>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="container py-5 text-center text-light">
        <h3 className="text-warning">Không thể tải thông tin hồ sơ</h3>
        <p>Có vẻ như phiên đăng nhập đã hết hạn hoặc có lỗi kết nối.</p>
        <button onClick={() => window.location.href = '/login'} className="btn btn-warning">
          ĐĂNG NHẬP LẠI
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="row g-4">
        
        {/* CỘT THÔNG TIN CÁ NHÂN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg h-100" style={{ backgroundColor: '#191919', borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                
                {/* --- ĐÃ FIX: CẬP NHẬT AVATAR MẶC ĐỊNH CHUẨN MYSTIC --- */}
                <img 
                  src="/images/default avatar.webp" 
                  onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                  alt="Avatar" 
                  className="rounded-circle border border-warning p-1 mb-3" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', backgroundColor: '#121212' }} 
                />
                
                <h4 className="fw-bold text-warning">{user?.name}</h4>
                <span className="badge bg-dark text-secondary border border-secondary mb-2">
                   {user?.role === 'admin' ? 'Quản trị viên Mystic' : 'Thành viên Mystic'}
                </span>

                {user?.role === 'admin' && (
                  <button 
                    onClick={() => router.push('/admin')}
                    className="btn btn-sm btn-outline-warning w-100 mt-2 fw-bold"
                  >
                    VÀO TRANG QUẢN TRỊ
                  </button>
                )}
              </div>

              {message && <div className="alert alert-success py-2 text-center small border-0 mb-3">{message}</div>}
              
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label text-secondary small mb-1">Email đăng nhập</label>
                  <input type="text" className="form-control bg-dark text-secondary border-0" value={user?.email || ''} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light small mb-1">Họ và Tên</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" value={user?.name || ''} onChange={(e) => setUser({...user, name: e.target.value})}/>
                </div>
                <div className="mb-4">
                  <label className="form-label text-light small mb-1">Số điện thoại</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" value={user?.phone || ''} onChange={(e) => setUser({...user, phone: e.target.value})}/>
                </div>
                <button type="submit" className="btn w-100 fw-bold py-2 shadow" style={{ backgroundColor: '#B8860B', color: '#121212' }}>LƯU THAY ĐỔI</button>
              </form>
            </div>
          </div>
        </div>

        {/* CỘT QUẢN LÝ LỊCH HẸN */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg h-100" style={{ backgroundColor: '#191919', borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4" style={{ color: '#B8860B' }}>QUẢN LÝ LỊCH HẸN</h4>
              
              <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
                <li className="nav-item">
                  <button className="nav-link active fw-bold text-light" id="pills-upcoming-tab" data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab">
                    Sắp tới <span className="badge bg-warning text-dark ms-2">{upcoming.length}</span>
                  </button>
                </li>
                <li className="nav-item ms-2">
                  <button className="nav-link fw-bold text-light" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab">
                    Đã hoàn thành <span className="badge bg-secondary ms-2">{history.length}</span>
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="pills-tabContent">
                {/* TAB SẮP TỚI */}
                <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
                  {upcoming.length === 0 ? (
                    <div className="text-center text-secondary py-5 bg-dark rounded border border-secondary border-opacity-25">Bạn chưa có lịch hẹn nào sắp tới.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark table-hover align-middle">
                        <thead>
                          <tr className="border-secondary border-opacity-25">
                            <th className="text-warning">Gói Dịch Vụ</th>
                            <th>Ngày & Giờ</th>
                            <th>Tổng Tiền</th>
                            <th className="text-center">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcoming.map((item) => (
                            <tr key={item._id} className="border-secondary border-opacity-10">
                              <td>
                                <ul className="list-unstyled mb-0 fw-bold small">
                                  {item.services?.map((svc: any, idx: number) => (
                                    <li key={idx}>- {svc.name}</li>
                                  ))}
                                </ul>
                                <small className="text-secondary fst-italic">Barber: {item.barber || 'Thợ bất kỳ'}</small>
                              </td>
                              <td>{item.date} <br/><small className="text-warning">{item.time}</small></td>
                              <td className="fw-bold text-info">{item.totalPrice?.toLocaleString('vi-VN')} đ</td>
                              <td className="text-center">
                                <span className={`badge ${['Pending', 'Chờ xác nhận'].includes(item.status) ? 'bg-warning text-dark' : 'bg-primary'}`}>
                                  {item.status?.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* TAB LỊCH SỬ */}
                <div className="tab-pane fade" id="pills-history" role="tabpanel">
                  {history.length === 0 ? (
                    <div className="text-center text-secondary py-5 bg-dark rounded border border-secondary border-opacity-25">Bạn chưa sử dụng dịch vụ nào.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark table-hover align-middle">
                        <thead>
                          <tr className="border-secondary border-opacity-25">
                            <th className="text-warning">Gói Dịch Vụ</th>
                            <th>Ngày cắt</th>
                            <th className="text-end">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((item) => (
                            <tr key={item._id} className="border-secondary border-opacity-10">
                              <td>
                                <ul className="list-unstyled mb-0 fw-bold small">
                                  {item.services?.map((svc: any, idx: number) => (
                                    <li key={idx}>- {svc.name}</li>
                                  ))}
                                </ul>
                              </td>
                              <td>{item.date}</td>
                              <td className="text-end">
                                <button onClick={() => handleRebook()} className="btn btn-sm btn-outline-warning fw-bold px-3">
                                  ĐẶT LẠI
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}