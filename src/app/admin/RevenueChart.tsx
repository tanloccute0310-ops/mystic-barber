"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
  // Hàm format tiền Việt Nam cho Tooltip khi rê chuột vào
 // Hàm format tiền Việt Nam cho Tooltip khi rê chuột vào
  const formatVND = (value: any) => {
    // Đổi chữ 'K' thành 'VNĐ' cho chuẩn (vì số đang là 100.000)
    return value.toLocaleString('vi-VN') + ' VNĐ'; 
  };

  return (
    <div className="card bg-dark border-secondary shadow-sm mt-4">
      <div className="card-header border-secondary bg-transparent py-3">
        <h5 className="mb-0 fw-bold text-warning">Doanh thu 7 ngày gần nhất</h5>
      </div>
      <div className="card-body p-4" style={{ height: '350px' }}>
        {data.length === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-secondary">
            Chưa có dữ liệu doanh thu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {/* SỬA 1: Đổi left: -20 thành left: 10 để không bị lẹm chữ */}
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              
              {/* SỬA 2: Lấy số tiền chia cho 1000 (ví dụ 100000 -> 100) rồi mới gắn chữ K */}
              <YAxis 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={60}
                tickFormatter={(val) => `${val / 1000}K`} 
              />
              
              <Tooltip 
                cursor={{ fill: '#2a2a2a' }}
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#B8860B', color: '#fff', borderRadius: '8px' }}
                formatter={(value: any) => [formatVND(value), 'Doanh thu']}
                labelStyle={{ color: '#B8860B', fontWeight: 'bold', marginBottom: '5px' }}
              />
              
              <Bar dataKey="revenue" fill="#B8860B" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

}