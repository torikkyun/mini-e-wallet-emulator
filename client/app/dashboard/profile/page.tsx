'use client';
import Sidebar from '../components/sidebar';
import { useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Lấy thông tin user từ API nếu muốn

  const handleUpdate = () => {
    // Gọi API cập nhật thông tin cá nhân
  };

  return (
    <div className="flex h-screen">
      <Sidebar current="/dashboard/profile" />
      <main className="flex-1 container mx-auto p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Cập nhật thông tin cá nhân</h1>
        <form
          className="grid gap-4 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            className="input"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
          <button className="btn btn-primary" type="submit">
            Cập nhật
          </button>
        </form>
      </main>
    </div>
  );
}
