# Buổi 6 — Kiểm thử sản phẩm và giỏ hàng

Ngày thực hiện: 09/10/2026. Phạm vi: toàn bộ `src/features/cart`, `src/features/products` và hook `src/hooks/usePagination.ts` (5 file). Không loại trừ nhánh hay dòng nghiệp vụ khỏi coverage.

## Chạy lại

```bash
npm ci
npm run test:coverage
npm run test:typecheck
npm run build
```

`npm run test:coverage` chạy `jest --coverage --runInBand`. Jest tự báo thất bại nếu bất kỳ chỉ số statements, branches, functions hoặc lines tổng thể thấp hơn 70%. Báo cáo HTML: [coverage/index.html](coverage/index.html). Ảnh nộp bài: [coverage.png](coverage.png).

## Kết quả

3 test suite thành công; **29/29 test case thành công**: 13 case reducer, 8 case hook và 8 case integration RTL. Các test tham số hóa được tính theo từng đầu vào chạy độc lập.

| Phạm vi | Statements | Branches | Functions | Lines |
| --- | ---: | ---: | ---: | ---: |
| Tổng | 100% | 98,14% | 100% | 100% |
| Giỏ hàng | 100% | 100% | 100% | 100% |
| Sản phẩm | 100% | 97,05% | 100% | 100% |
| Hook phân trang | 100% | 100% | 100% | 100% |

Mỗi file đều đạt ít nhất 70% trên cả bốn chỉ số. Nhánh chưa chạy: thông báo lỗi mặc định của `productsSlice.ts` khi rejected action không có `error.message` (dòng 39). Các lỗi HTTP và lỗi mạng có message đã được kiểm thử.

## Các hành vi kiểm thử

- **Unit reducer — 13 case:** khởi tạo rỗng; thêm mới; gộp sản phẩm trùng và giữ bất biến state đầu vào; giới hạn tồn kho; bỏ qua sản phẩm ngừng bán; bỏ qua tồn kho bằng 0; xóa đúng ID; cập nhật số lượng/giới hạn tồn kho; xóa khi số lượng bằng 0 hoặc âm; bỏ qua số thập phân hoặc NaN; bỏ qua ID không tồn tại.
- **Unit hook — 8 case:** chia dữ liệu và giới hạn hai biên; chuẩn hóa trang ngoài phạm vi/số lẻ/NaN; giảm số trang khi dữ liệu thu nhỏ; kích thước trang bằng 0, âm, Infinity hoặc NaN; dữ liệu rỗng.
- **Integration — 8 case:** giỏ rỗng; thay số lượng/tính tổng/xóa; loading → API thành công → thêm giỏ; lỗi HTTP → thử lại thành công; lỗi mạng; API trả danh sách rỗng; khóa mua sản phẩm không bán được; phân trang và bật/tắt yêu thích.

Integration dùng React Testing Library, ưu tiên `getByRole`, `findByRole`, `userEvent`, render component với Redux store thật mới cho mỗi test. Chỉ mock `fetch` ở biên API, không mock reducer, hook hoặc component; không gọi mạng thật. Zustand yêu thích được reset trước mỗi test. Test loading dùng Promise điều khiển thủ công để kiểm tra trạng thái chờ ổn định.

Babel chuyển TypeScript/JSX để Jest chạy; `test:typecheck` kiểm tra kiểu riêng. Transformer trong `tests/vite-env.cjs` thay `import.meta.env.BASE_URL` bằng `/` chỉ trong môi trường Jest. Mã ứng dụng giữ nguyên.

## Chụp lại ảnh báo cáo

Sau khi chạy coverage, dùng Puppeteer Core có sẵn trên máy:

```bash
node scripts/capture-coverage.mjs /duong/dan/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js
```

Script chụp trực tiếp báo cáo HTML của Jest bằng Chrome headless; có thể đặt `CHROME_PATH` nếu Chrome ở vị trí khác.

Build production và kiểm tra kiểu test đều thành công.
