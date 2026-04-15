import React from 'react';
import Link from 'next/link';
import { connectDB } from '../../lib/mongodb';
import Service from '../../models/Service';
import { notFound } from 'next/navigation';
import AddToCartBtn from '../../../components/AddToCartBtn';
import QuickBookBtn from '../../../components/QuickBookBtn';

async function getServiceDetail(id: string) {
  try {
    await connectDB();
    const svc = await Service.findById(id).lean();

    // LOGIC MỚI: Nếu không tìm thấy HOẶC dịch vụ đang ở trạng thái ẨN (isActive: false)
    if (!svc || svc.isActive === false) return null;

    return {
      _id: svc._id.toString(),
      name: svc.name,
      description: svc.description,
      price: svc.price,
      category: svc.category,
      image: svc.image || '/images/default-service.jpg'
    };
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
    return null;
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const service: any = await getServiceDetail(id);

  // Nếu service là null (do bị ẩn hoặc không tồn tại), Next.js sẽ hiện trang 404
  if (!service) {
    return notFound();
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      <div className="container py-5 mt-5">
        <Link href="/services" className="btn btn-outline-warning mb-4 border-2 fw-bold">
          ← QUAY LẠI DANH SÁCH
        </Link>
        
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="position-relative shadow-lg rounded-4 overflow-hidden border border-warning p-1">
              <img 
                src={service.image || '/images/default-service.jpg'} 
                alt={service.name} 
                className="img-fluid rounded-3 w-100 shadow-lg"
                style={{ height: '500px', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-warning mb-2" style={{ letterSpacing: '2px' }}>
              {service.name.toUpperCase()}
            </h1>
            <div className="d-flex align-items-center mb-4">
              <span className="badge bg-warning text-dark px-3 py-2 fs-5 fw-bold">
                {service.price.toLocaleString('vi-VN')} VND
              </span>
              <span className="text-secondary ms-3 fst-italic">Category: {service.category}</span>
            </div>
            
            <hr className="border-secondary opacity-25" />
            
            <p className="lead text-secondary mb-5" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {service.description || "Dịch vụ đẳng cấp chỉ có tại Mystic Barber. Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho quý ông."}
            </p>
            
            {/* NHÓM NÚT THAO TÁC */}
            <div className="d-flex flex-column flex-md-row gap-3 mt-4">
              <AddToCartBtn 
                svc={service} 
                className="btn py-3 fs-5 fw-bold flex-grow-1" 
                style={{ backgroundColor: '#B8860B', color: '#121212', borderRadius: '0' }}
              />
              
              <QuickBookBtn 
                svc={service} 
                className="btn btn-outline-light py-3 fs-5 fw-bold px-4 flex-grow-1"
                style={{ borderRadius: '0' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}