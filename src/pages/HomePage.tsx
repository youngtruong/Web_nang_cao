import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Base Project: Lập Trình Web Nâng Cao
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Khung dự án đã sẵn sàng với React, TypeScript, Tailwind CSS, React Router và Zustand.
        </p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-sm font-mono text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Cấu trúc thư mục /src:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><span className="text-primary-600 dark:text-primary-400">components/</span>: UI components dùng chung</li>
            <li><span className="text-primary-600 dark:text-primary-400">pages/</span>: Các trang giao diện</li>
            <li><span className="text-primary-600 dark:text-primary-400">layouts/</span>: Bố cục giao diện</li>
            <li><span className="text-primary-600 dark:text-primary-400">services/</span>: Tầng gọi API (Axios)</li>
            <li><span className="text-primary-600 dark:text-primary-400">store/</span>: Quản lý State toàn cục</li>
            <li><span className="text-primary-600 dark:text-primary-400">types/</span>: TypeScript Interfaces & Types</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
