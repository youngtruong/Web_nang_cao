import React from 'react';
import { ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react';
import { Accordion } from '@/components/common/Accordion';
import { Button } from '@/components/common/Button';
import { usePagination } from '@/hooks/usePagination';
import { Currency, Product } from '@/types/product.types';

const products: Product[] = [
  { id: '1', sku: 'KB-001', name: 'Bàn phím cơ Keychron K2', description: 'Layout 75%, kết nối Bluetooth và USB-C.', price: 2190000, currency: Currency.VND, stockQuantity: 18, isActive: true },
  { id: '2', sku: 'MS-014', name: 'Chuột Logitech MX Master 3S', description: 'Chuột công thái học, cảm biến 8K DPI.', price: 2490000, currency: Currency.VND, stockQuantity: 9, isActive: true },
  { id: '3', sku: 'MN-027', name: 'Màn hình Dell UltraSharp 27”', description: 'Độ phân giải 4K, tấm nền IPS, USB-C.', price: 12990000, currency: Currency.VND, stockQuantity: 6, isActive: true },
  { id: '4', sku: 'HP-008', name: 'Tai nghe Sony WH-1000XM5', description: 'Chống ồn chủ động và pin 30 giờ.', price: 7990000, currency: Currency.VND, stockQuantity: 12, isActive: true },
  { id: '5', sku: 'ST-042', name: 'Giá đỡ laptop nhôm', description: 'Điều chỉnh độ cao, phù hợp laptop 11–17 inch.', price: 690000, currency: Currency.VND, stockQuantity: 31, isActive: true },
  { id: '6', sku: 'WB-019', name: 'Webcam Logitech Brio 500', description: 'Hình ảnh Full HD, tự động cân bằng sáng.', price: 2890000, currency: Currency.VND, stockQuantity: 0, isActive: false },
  { id: '7', sku: 'MC-033', name: 'Microphone HyperX SoloCast', description: 'Micro USB cardioid dành cho họp và streaming.', price: 1390000, currency: Currency.VND, stockQuantity: 15, isActive: true },
];

const formatPrice = (price: number, currency: Currency) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);

export const HomePage: React.FC = () => {
  const { currentPage, totalPages, currentItems, nextPage, prevPage, goToPage } = usePagination(products, 3);

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

      <section aria-labelledby="products-heading">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Custom hook generic</p>
            <h2 id="products-heading" className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Danh sách sản phẩm</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trang {currentPage} / {totalPages}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {currentItems.map((product) => (
            <article key={product.id} className="flex min-h-64 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">{product.sku}</span>
                <span className={`text-xs font-medium ${product.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {product.isActive ? `Còn ${product.stockQuantity}` : 'Hết hàng'}
                </span>
              </div>
              <PackageCheck aria-hidden="true" className="mb-4 h-8 w-8 text-primary-500" />
              <h3 className="text-lg font-semibold leading-6 text-gray-950 dark:text-white">{product.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{product.description}</p>
              <p className="mt-5 text-lg font-bold text-gray-950 dark:text-white">{formatPrice(product.price, product.currency)}</p>
            </article>
          ))}
        </div>

        <nav aria-label="Phân trang sản phẩm" className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" onClick={prevPage} disabled={currentPage === 1} aria-label="Trang trước">
            <ChevronLeft aria-hidden="true" className="mr-1 h-4 w-4" /> Trước
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'outline'}
              onClick={() => goToPage(page)}
              aria-label={`Đi tới trang ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className="min-w-10 px-3"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages} aria-label="Trang sau">
            Sau <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
          </Button>
        </nav>
      </section>
    </div>
  );
};
