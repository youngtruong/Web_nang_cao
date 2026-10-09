import reducer, { addItem, removeItem, updateQuantity } from '@/features/cart/cartSlice';
import { product } from './fixtures';
const filled = () => reducer(undefined, addItem(product));
describe('Giỏ hàng — reducer', () => {
  it('khởi tạo giỏ rỗng', () => expect(reducer(undefined, { type: 'unknown' })).toEqual({ items: [] }));
  it('thêm sản phẩm mới với số lượng 1', () => expect(filled().items).toEqual([{ product, quantity: 1 }]));
  it('gộp sản phẩm trùng và không thay đổi state đầu vào', () => {
    const before = filled(); const after = reducer(before, addItem(product));
    expect(after.items).toHaveLength(1); expect(after.items[0].quantity).toBe(2); expect(before.items[0].quantity).toBe(1);
  });
  it('không thêm vượt tồn kho', () => {
    let state = filled(); for (let i = 0; i < 5; i++) state = reducer(state, addItem(product));
    expect(state.items[0].quantity).toBe(3);
  });
  it.each([{ isActive: false }, { stockQuantity: 0 }])('bỏ qua sản phẩm không bán được: %j', (override) => {
    expect(reducer(undefined, addItem({ ...product, ...override })).items).toEqual([]);
  });
  it('xóa đúng sản phẩm, giữ sản phẩm khác', () => {
    const other = { ...product, id: 'p2' };
    expect(reducer(reducer(filled(), addItem(other)), removeItem(product.id)).items).toEqual([{ product: other, quantity: 1 }]);
  });
  it('cập nhật số lượng và chặn vượt tồn kho', () => {
    const state = reducer(filled(), updateQuantity({ productId: 'p1', quantity: 2 }));
    expect(state.items[0].quantity).toBe(2);
    expect(reducer(state, updateQuantity({ productId: 'p1', quantity: 100 })).items[0].quantity).toBe(3);
  });
  it.each([0, -1])('xóa sản phẩm khi số lượng là %s', quantity => expect(reducer(filled(), updateQuantity({ productId: 'p1', quantity })).items).toEqual([]));
  it.each([1.5, NaN])('bỏ qua số lượng không nguyên %s', quantity => expect(reducer(filled(), updateQuantity({ productId: 'p1', quantity }))).toEqual(filled()));
  it('bỏ qua cập nhật ID không tồn tại', () => expect(reducer(filled(), updateQuantity({ productId: 'missing', quantity: 2 }))).toEqual(filled()));
});
