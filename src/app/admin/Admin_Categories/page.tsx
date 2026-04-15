"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Nhớ import Link để làm menu sidebar

// Khai báo kiểu dữ liệu cho Category
interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trạng thái Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1. Hàm Tải Dữ Liệu
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (err) {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Hàm Xử Lý Gửi Form (Thêm hoặc Cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const url = editId ? `/api/categories/${editId}` : "/api/categories";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Reset Form
        setName("");
        setDescription("");
        setEditId(null);
        // Tải lại danh sách
        fetchCategories();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi");
    }
  };

  // 3. Hàm Chuẩn bị Chỉnh Sửa
  const handleEdit = (cat: Category) => {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên form
  };

  // 4. Hàm Xóa
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories(); // Tải lại danh sách
      } else {
         alert("Xóa thất bại");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* --- SIDEBAR CHUẨN MYSTIC --- */}
      <div className="bg-dark p-4 shadow-lg border-end border-secondary flex-shrink-0" style={{ width: '280px' }}>
        <h3 className="text-warning fw-bold mb-5 border-bottom border-secondary pb-3 text-uppercase text-center">
          Mystic Admin
        </h3>
        <ul className="nav flex-column gap-3">
          <li className="nav-item">
            <Link href="/admin" className="nav-link text-light hover-warning px-3 py-2">
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
            {/* Nút Danh mục được bôi vàng để báo đang ở trang này */}
            <Link href="/admin/Admin_Category" className="nav-link text-dark bg-warning rounded fw-bold px-3 py-2">
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

      {/* --- MAIN CONTENT (KHU VỰC NỘI DUNG CHÍNH) --- */}
      <div className="flex-grow-1 p-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        <h2 className="fw-bold mb-4 text-uppercase" style={{ color: "#B8860B" }}>
          Quản lý danh mục dịch vụ
        </h2>

        <div className="row g-4">
          {/* --- CỘT TRÁI: FORM NHẬP LIỆU --- */}
          <div className="col-lg-4">
            <div className="card border-secondary shadow" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="card-body p-4">
                <h5 className="fw-bold text-warning mb-3">
                  {editId ? "CHỈNH SỬA DANH MỤC" : "THÊM DANH MỤC MỚI"}
                </h5>

                {message && <div className="alert alert-success py-2 small">{message}</div>}
                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Tên danh mục *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-secondary">Mô tả (Tùy chọn)</label>
                    <textarea
                      className="form-control bg-dark text-light border-secondary"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-warning w-100 fw-bold">
                      {editId ? "CẬP NHẬT" : "THÊM MỚI"}
                      </button>
                      {editId && (
                          <button type="button" className="btn btn-outline-secondary w-50" onClick={() => { setEditId(null); setName(""); setDescription(""); }}>
                              HỦY
                          </button>
                      )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: DANH SÁCH --- */}
          <div className="col-lg-8">
            <div className="card border-secondary shadow h-100" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="card-body p-4">
                <h5 className="fw-bold text-warning mb-3">DANH SÁCH DANH MỤC</h5>
                
                {isLoading ? (
                  <div className="text-center py-4 text-warning"><span className="spinner-border spinner-border-sm me-2"></span>Đang tải...</div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-4 text-secondary border border-secondary border-opacity-25 rounded">Chưa có danh mục nào.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                      <thead>
                        <tr className="border-secondary text-secondary small text-uppercase">
                          <th>Tên Danh Mục</th>
                          <th>Mô Tả</th>
                          <th className="text-end">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat._id} className="border-secondary border-opacity-25">
                            <td className="fw-bold text-light">{cat.name}</td>
                            <td className="text-secondary small">{cat.description || <em className="text-muted">Không có mô tả</em>}</td>
                            <td className="text-end">
                              <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-outline-info me-2">
                                Sửa
                              </button>
                              <button onClick={() => handleDelete(cat._id)} className="btn btn-sm btn-outline-danger">
                                Xóa
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
      
      {/* Style nhỏ cho menu hover */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-warning:hover { color: #B8860B !important; }
      `}} />
    </div>
  );
}