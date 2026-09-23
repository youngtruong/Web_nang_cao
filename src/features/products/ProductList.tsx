import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, PackageCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/common/Button';
import { usePagination } from '@/hooks/usePagination';
import { addItem } from '@/features/cart/cartSlice';
import { fetchProducts } from './productsSlice';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';

export function ProductList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const favoriteItems = useFavoritesStore((state) => state.items);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const { currentPage, totalPages, currentItems, nextPage, prevPage, goToPage } = usePagination(items, 3);

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchProducts());
  }, [dispatch, status]);

  return (
    <section aria-labelledby="products-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="products-heading" className="text-3xl font-bold">Danh sách sản phẩm</h2>
        {status === 'succeeded' && <p className="text-sm text-gray-500">Trang {currentPage} / {totalPages}</p>}
      </div>
      {status === 'loading' && <p role="status">Đang tải sản phẩm...</p>}
      {status === 'failed' && (
        <div role="alert" className="space-y-3">
          <p>{error}</p>
          <Button onClick={() => void dispatch(fetchProducts())}>Thử lại</Button>
        </div>
      )}
      {status === 'succeeded' && items.length === 0 && <p>Chưa có sản phẩm.</p>}
      {status === 'succeeded' && items.length > 0 && <>
        <div className="grid gap-4 md:grid-cols-3">
          {currentItems.map((product) => (
            <article key={product.id} className="flex min-h-64 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">{product.sku}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${product.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {product.isActive ? `Còn ${product.stockQuantity}` : 'Hết hàng'}
                  </span>
                  {(() => {
                    const isFavorite = favoriteItems.some((item) => item.id === product.id);
                    return (
                      <button
                        type="button"
                        onClick={() => toggleFavorite(product)}
                        aria-label={`${isFavorite ? 'Bỏ' : 'Thêm'} ${product.name} ${isFavorite ? 'khỏi' : 'vào'} danh sách yêu thích`}
                        aria-pressed={isFavorite}
                        className="rounded-full p-1.5 text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:hover:bg-rose-950"
                      >
                        <Heart aria-hidden="true" className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    );
                  })()}
                </div>
              </div>
              <PackageCheck aria-hidden="true" className="mb-4 h-8 w-8 text-primary-500" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{product.description}</p>
              <p className="mt-5 text-lg font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: product.currency }).format(product.price)}</p>
              <Button className="mt-3" disabled={!product.isActive || product.stockQuantity === 0} onClick={() => dispatch(addItem(product))}>
                Thêm vào giỏ
              </Button>
            </article>
          ))}
        </div>
        <nav aria-label="Phân trang sản phẩm" className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}><ChevronLeft className="mr-1 h-4 w-4" />Trước</Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button key={page} variant={page === currentPage ? 'primary' : 'outline'} onClick={() => goToPage(page)} aria-label={`Đi tới trang ${page}`} aria-current={page === currentPage ? 'page' : undefined}>{page}</Button>
          ))}
          <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>Sau<ChevronRight className="ml-1 h-4 w-4" /></Button>
        </nav>
      </>}
    </section>
  );
}
