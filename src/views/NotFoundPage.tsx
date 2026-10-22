import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-black text-primary-600 dark:text-primary-400">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Trang không tồn tại</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2 mb-6">
        Đường dẫn bạn truy cập có thể đã bị thay đổi hoặc không còn tồn tại trên hệ thống.
      </p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </Button>
      </Link>
    </div>
  );
};
