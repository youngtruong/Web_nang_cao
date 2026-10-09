import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cartReducer, { addItem } from '@/features/cart/cartSlice';
import productsReducer from '@/features/products/productsSlice';
import { CartSummary } from '@/features/cart/CartSummary';
import { ProductList } from '@/features/products/ProductList';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { product } from './fixtures';

const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;
beforeEach(() => { globalThis.fetch = fetchMock; useFavoritesStore.setState({ items: [] }); });
afterAll(() => { globalThis.fetch = originalFetch; });
function setup(showProducts = false, filled = false) {
  const store = configureStore({ reducer: { cart: cartReducer, products: productsReducer } });
  if (filled) store.dispatch(addItem(product));
  render(<Provider store={store}>{showProducts && <ProductList />}<CartSummary /></Provider>);
  return userEvent.setup();
}
const response = (items = [product]) => ({ ok: true, json: async () => items });
describe('Sản phẩm + giỏ hàng — RTL với Redux thật và API mock', () => {
  it('hiển thị giỏ hàng trống', () => {
    setup(); expect(screen.getByRole('heading', { name: 'Giỏ hàng (0)' })).toBeInTheDocument();
    expect(screen.getByText('Giỏ hàng đang trống.')).toBeInTheDocument();
  });
  it('đổi số lượng, tính tổng tiền và xóa sản phẩm', async () => {
    const user = setup(false, true);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Số lượng' }), { target: { value: '2' } });
    expect(screen.getByRole('heading', { name: 'Giỏ hàng (2)' })).toBeInTheDocument();
    expect(screen.getByText(/Tổng cộng:/)).toHaveTextContent(/200\.000/);
    await user.click(screen.getByRole('button', { name: 'Xoá' }));
    expect(screen.getByText('Giỏ hàng đang trống.')).toBeInTheDocument();
  });
  it('hiển thị loading rồi tải API và thêm sản phẩm vào giỏ', async () => {
    let resolve!: (value: ReturnType<typeof response>) => void;
    fetchMock.mockImplementationOnce(() => new Promise(r => { resolve = r; }));
    const user = setup(true);
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải sản phẩm');
    resolve(response());
    expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/products.json');
    await user.click(screen.getByRole('button', { name: 'Thêm vào giỏ' }));
    expect(screen.getByRole('heading', { name: 'Giỏ hàng (1)' })).toBeInTheDocument();
    expect(screen.getByText(/Tổng cộng:/)).toHaveTextContent(/100\.000/);
  });
  it('hiển thị lỗi HTTP và cho phép thử lại thành công', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValueOnce(response());
    const user = setup(true);
    expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được sản phẩm (503)');
    await user.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('hiển thị lỗi mạng từ API mockRejectedValue', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Mất kết nối'));
    setup(true); expect(await screen.findByRole('alert')).toHaveTextContent('Mất kết nối');
  });
  it('hiển thị danh sách rỗng từ API', async () => {
    fetchMock.mockResolvedValueOnce(response([])); setup(true);
    expect(await screen.findByText('Chưa có sản phẩm.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Thêm vào giỏ' })).not.toBeInTheDocument();
  });
  it('khóa nút mua sản phẩm ngừng bán và hết tồn kho', async () => {
    fetchMock.mockResolvedValueOnce(response([{ ...product, isActive: false }, { ...product, id: 'p2', name: 'Áo hết kho', stockQuantity: 0 }]));
    setup(true); await screen.findByRole('heading', { name: product.name });
    for (const button of screen.getAllByRole('button', { name: 'Thêm vào giỏ' })) expect(button).toBeDisabled();
  });
  it('phân trang và bật/tắt yêu thích qua thao tác người dùng', async () => {
    fetchMock.mockResolvedValueOnce(response([product, ...[2, 3, 4].map(i => ({ ...product, id: `p${i}`, name: `Áo ${i}` }))]));
    const user = setup(true); await screen.findByRole('heading', { name: product.name });
    const nav = screen.getByRole('navigation', { name: 'Phân trang sản phẩm' });
    expect(within(nav).getByRole('button', { name: 'Trước' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: `Thêm ${product.name} vào danh sách yêu thích` }));
    const favorite = screen.getByRole('button', { name: `Bỏ ${product.name} khỏi danh sách yêu thích` });
    expect(favorite).toHaveAttribute('aria-pressed', 'true'); await user.click(favorite);
    expect(screen.getByRole('button', { name: `Thêm ${product.name} vào danh sách yêu thích` })).toHaveAttribute('aria-pressed', 'false');
    await user.click(within(nav).getByRole('button', { name: 'Sau' }));
    expect(screen.getByRole('heading', { name: 'Áo 4' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Sau' })).toBeDisabled();
    await user.click(within(nav).getByRole('button', { name: 'Trước' }));
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    await user.click(within(nav).getByRole('button', { name: 'Đi tới trang 2' }));
    expect(screen.getByRole('heading', { name: 'Áo 4' })).toBeInTheDocument();
  });
});
