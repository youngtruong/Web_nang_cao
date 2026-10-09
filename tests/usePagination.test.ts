import { act, renderHook } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';
describe('Phân trang — hook', () => {
  it('chia dữ liệu và chặn di chuyển ở hai biên', () => {
    const { result } = renderHook(() => usePagination([1, 2, 3, 4], 2));
    expect(result.current.currentItems).toEqual([1, 2]);
    act(() => result.current.prevPage()); expect(result.current.currentPage).toBe(1);
    act(() => result.current.nextPage()); expect(result.current.currentItems).toEqual([3, 4]);
    act(() => result.current.nextPage()); expect(result.current.currentPage).toBe(2);
    act(() => result.current.prevPage()); expect(result.current.currentPage).toBe(1);
  });
  it('chuẩn hóa trang ngoài phạm vi, số lẻ và NaN', () => {
    const { result } = renderHook(() => usePagination([1, 2, 3], 1));
    for (const [input, expected] of [[99, 3], [-1, 1], [2.9, 2], [NaN, 1]]) {
      act(() => result.current.goToPage(input)); expect(result.current.currentPage).toBe(expected);
    }
  });
  it('thu nhỏ dữ liệu khi đang ở trang cuối', () => {
    const { result, rerender } = renderHook(({ data }) => usePagination(data, 1), { initialProps: { data: [1, 2, 3] } });
    act(() => result.current.goToPage(3)); rerender({ data: [1] });
    expect(result.current.currentPage).toBe(1); expect(result.current.currentItems).toEqual([1]);
  });
  it.each([0, -1, Infinity, NaN])('dùng kích thước 1 khi giá trị không hợp lệ %s', size => {
    const { result } = renderHook(() => usePagination([1, 2], size)); expect(result.current.totalPages).toBe(2);
  });
  it('dữ liệu rỗng vẫn có trang 1', () => {
    const { result } = renderHook(() => usePagination([], 3)); expect(result.current.totalPages).toBe(1); expect(result.current.currentItems).toEqual([]);
  });
});
