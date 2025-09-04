'use client';
import Sidebar from '../components/sidebar';

export default function BillsPage() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 container mx-auto p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Thanh toán hóa đơn</h1>
        <div className="grid gap-4">
          <button className="btn">Thanh toán tiền điện</button>
          <button className="btn">Thanh toán tiền nước</button>
          <button className="btn">Thanh toán điện thoại</button>
          {/* Thêm các loại hóa đơn khác nếu muốn */}
        </div>
        {/* Thêm form nhập mã khách hàng, số tiền, xác nhận thanh toán... */}
      </main>
    </div>
  );
}
