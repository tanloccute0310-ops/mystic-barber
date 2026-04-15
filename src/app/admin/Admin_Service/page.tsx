import React from 'react';
import Link from 'next/link';
import { connectDB } from '../../lib/mongodb';
import Service from '../../models/Service';
import Category from '../../models/Category'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; 

export const dynamic = 'force-dynamic';

// 1. Hàm lấy danh sách DỊCH VỤ
async function getServices() {
  try {
    await connectDB();
    const services = await Service.find().sort({ _id: -1 }).lean();
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    return [];
  }
}

// 2. Hàm lấy danh sách DANH MỤC
async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    return []; 
  }
}

export default async function AdminServicesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ editId?: string }> 
}) {
  const { editId } = await searchParams;
  
  // Tải song song cả 2 dữ liệu lên
  const services = await getServices();
  const categories = await getCategories(); 
  
  const editingService = editId ? services.find((s: any) => s._id === editId) : null;

  // SERVER ACTION: Lưu (Thêm mới hoặc Cập nhật)
  async function handleSaveService(formData: FormData) {
    'use server';
    const id = formData.get('id') as string | null; // Có thể null
    
    const data = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      category: formData.get('category'), 
      description: formData.get('description'),
      image: formData.get('image') || '/images/default-service.jpg'
    };

    try {
      await connectDB();
      
      // LOGIC MỚI: Bắt ID cực chuẩn. 
      // Chỉ khi có ID hợp lệ mới Cập nhật, còn lại là Thêm mới.
      if (id && id.length > 10 && id !== 'undefined' && id !== 'null') {
        await Service.findByIdAndUpdate(id, data);
      } else {
        await Service.create(data);
      }     
      
      // Bẻ gãy cache để giao diện tải lại số mới
      revalidatePath('/admin/Admin_Service');
      revalidatePath('/services'); 
      
    } catch (error: any) {
      // IN LỖI TO RÕ RÀNG TRÊN TERMINAL NẾU DB TỪ CHỐI
      console.log("=== LỖI KHI LƯU DỊCH VỤ ===");
      console.error(error.message);
      console.log("===========================");
    }
    
    redirect('/admin/Admin_Service'); 
  }

  // SERVER ACTION: Ẩn/Hiện (GIỮ NGUYÊN)
  async function toggleServiceStatus(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentStatus = formData.get('currentStatus') === 'true';
    try {
      await connectDB();
      await Service.findByIdAndUpdate(id, { isActive: !currentStatus });
      revalidatePath('/admin/Admin_Service');
      revalidatePath('/services');
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  }

  return (
    <div className="d-flex" style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* SIDEBAR */}
      <div className="bg-dark p-4 shadow-lg border-end border-secondary" style={{ width: '280px' }}>
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
            <Link href="/admin/Admin_Service" className="nav-link text-dark bg-warning rounded fw-bold px-3 py-2">
               Quản lý Dịch Vụ
            </Link>
          </li>
          <li className="nav-item">
          <Link href="/admin/Admin_Categories" className="nav-link text-light hover-warning px-3 py-2">
            Quản lý Danh mục
          </Link>
        </li>
        </ul>
      </div>

      <div className="flex-grow-1 p-5">
        <div className="row g-5">
          {/* CỘT TRÁI: DANH SÁCH */}
          <div className="col-lg-8">
            <h2 className="fw-bold mb-4 text-uppercase">Danh sách dịch vụ</h2>
            <div className="card bg-dark border-secondary shadow-lg">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr className="text-warning border-secondary">
                      <th className="py-3 ps-4">Ảnh</th>
                      <th>Tên dịch vụ</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc: any) => {
                      const isActive = svc.isActive !== false;
                      return (
                        <tr key={svc._id} style={{ opacity: isActive ? 1 : 0.5 }}>
                          <td className="ps-4">
                            <img src={svc.image} width="50" height="50" className="rounded object-fit-cover border border-secondary" alt="" />
                          </td>
                          <td className="fw-bold">{svc.name}</td>
                          <td className="text-info">{svc.price.toLocaleString('vi-VN')}K</td>
                          <td>
                            <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {isActive ? 'Đang bán' : 'Đã ẩn'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Link href={`/admin/Admin_Service?editId=${svc._id}`} className="btn btn-sm btn-outline-light">SỬA</Link>
                              <form action={toggleServiceStatus}>
                                <input type="hidden" name="id" value={svc._id.toString()} />
                                <input type="hidden" name="currentStatus" value={isActive.toString()} />
                                <button type="submit" className={`btn btn-sm ${isActive ? 'btn-outline-warning' : 'btn-outline-info'}`}>
                                  {isActive ? 'ẨN' : 'HIỆN'}
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {services.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-secondary">
                          Chưa có dịch vụ nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM */}
          <div className="col-lg-4">
            <h2 className="fw-bold mb-4 text-uppercase">
              {editingService ? 'Chỉnh sửa' : 'Thêm mới'}
            </h2>
            <div className="card bg-dark border-warning shadow-lg p-4">
              <form action={handleSaveService} key={editingService ? editingService._id : 'new'}>
                
                {/* LOGIC MỚI: Chỉ render Input ID khi đang CHỈNH SỬA */}
                {editingService && (
                   <input type="hidden" name="id" value={editingService._id.toString()} />
                )}

                <div className="mb-3">
                  <label className="form-label text-secondary small">Tên dịch vụ</label>
                  <input type="text" name="name" required defaultValue={editingService?.name || ''} className="form-control bg-dark text-light border-secondary" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Giá (K)</label>
                  <input type="number" name="price" required defaultValue={editingService?.price || ''} className="form-control bg-dark text-light border-secondary" />
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-secondary small">Danh mục</label>
                  <select name="category" defaultValue={editingService?.category || ''} className="form-select bg-dark text-light border-secondary" required>
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.length === 0 && <option value="" disabled>Chưa có danh mục nào</option>}
                    
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Link ảnh (URL)</label>
                  <input type="text" name="image" defaultValue={editingService?.image || ''} className="form-control bg-dark text-light border-secondary" />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Mô tả ngắn</label>
                  <textarea name="description" rows={3} defaultValue={editingService?.description || ''} className="form-control bg-dark text-light border-secondary"></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning flex-grow-1 fw-bold text-dark">
                    {editingService ? 'CẬP NHẬT NGAY' : 'LƯU DỊCH VỤ'}
                  </button>
                  
                  {editingService && (
                    <Link href="/admin/Admin_Service" className="btn btn-outline-secondary fw-bold">
                      HỦY
                    </Link>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}