import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/common/Button';
import { removeItem, updateQuantity } from './cartSlice';

export function CartSummary() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return <section aria-labelledby="cart-heading" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <h2 id="cart-heading" className="text-2xl font-bold">Giỏ hàng ({count})</h2>
    {items.length === 0 ? <p className="mt-4 text-gray-500">Giỏ hàng đang trống.</p> : <>
      <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {items.map(({ product, quantity }) => <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div><p className="font-semibold">{product.name}</p><p className="text-sm text-gray-500">{formatPrice(product.price)} / sản phẩm</p></div>
          <div className="flex items-center gap-2">
            <label htmlFor={`quantity-${product.id}`} className="text-sm">Số lượng</label>
            <input id={`quantity-${product.id}`} type="number" min="1" max={product.stockQuantity} value={quantity}
              onChange={(event) => dispatch(updateQuantity({ productId: product.id, quantity: Number(event.target.value) }))}
              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-600" />
            <Button variant="danger" size="sm" onClick={() => dispatch(removeItem(product.id))}>Xoá</Button>
          </div>
        </li>)}
      </ul>
      <p className="mt-4 text-right text-lg font-bold">Tổng cộng: {formatPrice(total)}</p>
    </>}
  </section>;
}
