import React from 'react';
import { Accordion } from '@/components/common/Accordion';
import { ProductList } from '@/features/products/ProductList';
import { CartSummary } from '@/features/cart/CartSummary';

export const HomePage: React.FC = () => {

  return (
    <div className="space-y-12 py-6 sm:py-10">
      <section aria-labelledby="accordion-heading" className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Compound component</p>
          <h1 id="accordion-heading" className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Câu hỏi thường gặp</h1>
          <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">Mỗi lần chỉ có một nội dung được mở. Chọn lại tiêu đề để đóng panel hiện tại.</p>
        </div>

        <Accordion defaultValue="context" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Accordion.Item value="context">
            <Accordion.Trigger>Accordion dùng Context API như thế nào?</Accordion.Trigger>
            <Accordion.Content>Component gốc quản lý giá trị của panel đang mở và cung cấp state qua Context. Các component con chỉ đọc Context, vì vậy API sử dụng gọn và không cần truyền props qua nhiều tầng.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="single">
            <Accordion.Trigger>Vì sao chỉ một panel được mở?</Accordion.Trigger>
            <Accordion.Content>Context chỉ lưu một <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-700">openValue</code>. Khi mở item mới, giá trị cũ được thay thế; khi chọn lại item hiện tại, giá trị được đặt về null.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="accessible">
            <Accordion.Trigger>Component có hỗ trợ accessibility không?</Accordion.Trigger>
            <Accordion.Content>Có. Trigger là button thật, dùng aria-expanded và aria-controls; vùng nội dung có role region và liên kết ngược tới trigger bằng aria-labelledby.</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>

      <ProductList />
      <CartSummary />
    </div>
  );
};
