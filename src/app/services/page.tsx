import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '../lib/mongodb'; 
import Service from '../models/Service';
import Category from '../models/Category';
import AddToCartBtn from '../../components/AddToCartBtn';

export const metadata: Metadata = {
  title: "Bảng Giá Dịch Vụ - Mystic Barber",
  description: "Bảng giá cắt tóc, cạo râu và các gói combo chăm sóc nam giới.",
};

// 1. Hàm lấy Dịch Vụ (Giữ nguyên của Lộc)
async function getServicesFromDB() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: { $ne: false } }).sort({ _id: -1 }).lean();
    
    return services.map((svc: any) => ({
      _id: svc._id.toString(),
      name: svc.name,
      description: svc.description,
      price: svc.price,
      category: svc.category,
      image: svc.image || '/images/default-service.jpg'
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dịch vụ:", error);
    return [];
  }
}

// 2. Hàm lấy Danh Mục Động từ DB
async function getCategoriesFromDB() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: 1 }).lean();
    return categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const allServices = await getServicesFromDB();
  const categories = await getCategoriesFromDB();

  // Component hiển thị 1 Dịch Vụ (Giữ nguyên UI của Lộc)
  const renderServiceItem = (svc: any) => (
    <div key={svc._id} className="service-item d-flex align-items-center mb-4 p-3 rounded shadow-sm" 
         style={{ backgroundColor: '#191919', border: '1px solid #222', transition: '0.3s' }}>
      <div className="flex-shrink-0 me-3">
        <img 
          src={svc.image} 
          alt={svc.name} 
          className="rounded object-fit-cover border border-secondary"
          style={{ width: '90px', height: '90px' }}
        />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="text-light mb-1 fw-bold">{svc.name}</h5>
            <p className="text-secondary small mb-2" style={{ lineHeight: '1.4' }}>{svc.description}</p>
          </div>
          <div className="fs-5 fw-bold ms-2" style={{ color: '#B8860B', whiteSpace: 'nowrap' }}>
            {svc.price.toLocaleString('vi-VN')} đ
          </div>
        </div>
        <div className="d-flex gap-3 mt-1 align-items-center">
          <Link href={`/services/${svc._id}`} 
                className="text-warning text-decoration-none small fw-bold text-uppercase hover-opacity"
                style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
            Chi tiết →
          </Link>
          <AddToCartBtn svc={svc} />
        </div>
      </div>
    </div>
  );

  // Hàm chia mảng làm 2 để giữ bố cục 2 cột của Lộc
  const renderTwoColumns = (servicesArray: any[]) => {
    if (servicesArray.length === 0) {
      return (
        <div className="text-center py-5 w-100">
          <i className="bi bi-box-seam fs-1 text-secondary mb-3 d-block"></i>
          <p className="text-secondary fst-italic">Danh mục này hiện chưa có dịch vụ nào.</p>
        </div>
      );
    }
    
    const midPoint = Math.ceil(servicesArray.length / 2);
    const col1 = servicesArray.slice(0, midPoint);
    const col2 = servicesArray.slice(midPoint);

    return (
      <div className="row g-5">
        <div className="col-lg-6">{col1.map(renderServiceItem)}</div>
        <div className="col-lg-6">{col2.map(renderServiceItem)}</div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', paddingBottom: '80px' }}>     
      {/* --- HEADER MYSTIC --- */}
      <div className="py-5 text-center" style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/images/barber-bg.jpg")',
        backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '2px solid #B8860B' 
      }}>
        <div className="container mt-4 py-4">
          <h1 className="display-3 fw-bold text-warning" style={{ letterSpacing: '4px' }}>MYSTIC SERVICES</h1>
          <p className="lead text-light mt-3 text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            Đẳng Cấp Quý Ông
          </p>
        </div>
      </div>

      <div className="container mt-5 pt-4">
        
        {/* --- TABS BỘ LỌC DANH MỤC --- */}
        <ul className="nav nav-pills justify-content-center mb-5 custom-tabs" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active fw-bold text-uppercase rounded-pill px-4" id="pills-all-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab">
              Tất Cả
            </button>
          </li>
          
          {categories.map((cat: any) => (
            <li className="nav-item ms-2 mt-2 mt-md-0" key={cat._id} role="presentation">
              <button className="nav-link fw-bold text-uppercase rounded-pill px-4" id={`pills-${cat._id}-tab`} data-bs-toggle="pill" data-bs-target={`#pills-${cat._id}`} type="button" role="tab">
                {cat.name}
              </button>
            </li>
          ))}
        </ul>

        {/* --- NỘI DUNG TỪNG TAB --- */}
        <div className="tab-content" id="pills-tabContent">
          
          {/* TAB TẤT CẢ */}
          <div className="tab-pane fade show active" id="pills-all" role="tabpanel">
             {renderTwoColumns(allServices)}
          </div>

          {/* TẠO TAB ĐỘNG CHO TỪNG DANH MỤC */}
          {categories.map((cat: any) => {
            // Lọc ra các dịch vụ thuộc danh mục này
            // So sánh xem cột category trong Service có khớp với name hoặc _id của Category không
            const filteredServices = allServices.filter((svc: any) => 
              svc.category === cat._id || svc.category?.toLowerCase() === cat.name.toLowerCase()
            );

            return (
              <div className="tab-pane fade" id={`pills-${cat._id}`} role="tabpanel" key={cat._id}>
                 {renderTwoColumns(filteredServices)}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* --- CSS CHO TABS VÀ HOVER HIỆU ỨNG --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .service-item:hover { border-color: #B8860B !important; transform: translateX(10px); background-color: #222 !important; }
        .service-item img { transition: 0.5s ease; }
        .service-item:hover img { transform: scale(1.05); border-color: #B8860B !important; }
        .hover-opacity:hover { opacity: 0.8; }
        
        /* Chỉnh style cho Tab để hợp tông Mystic */
        .custom-tabs .nav-link { color: #888; border: 1px solid transparent; transition: all 0.3s ease; }
        .custom-tabs .nav-link:hover { color: #B8860B; }
        .custom-tabs .nav-link.active { background-color: transparent !important; color: #B8860B !important; border-color: #B8860B; box-shadow: 0 0 10px rgba(184, 134, 11, 0.2); }
      `}} />
    </div>
  );
}