# Báo cáo Buổi 5 — Tối ưu hiệu năng ứng dụng React

**Ngày đo:** 03/10/2026, 20:28–20:30 (Asia/Ho_Chi_Minh).  
**Trang:** Product Lab — quản lý 10.000 sản phẩm giả lập.  
**Mã nguồn:** [main.tsx](../src/performance/main.tsx).  
**Tài liệu bài học:** `Buoi5_Toi_Uu_Hieu_Nang_React.pptx`, slide 8–13, 20–25 và 38.

## 1. Trang thực hành và cách so sánh

Trang dùng React 18, TypeScript và Vite, có tìm kiếm tên sản phẩm, lọc bốn danh mục, sắp xếp theo mã/giá, chọn sản phẩm và bỏ chọn tất cả. Dữ liệu được sinh cố định bằng `Array.from`, không gọi API hay tải ảnh từ mạng.

- **Trước:** `/performance.html?mode=before` render cả 10.000 dòng, tính lại lọc/sắp xếp khi state thay đổi, dùng component dòng không memo và callback tạo lại.
- **Sau:** `/performance.html?mode=after` dùng virtualization và memoization.

Hai chế độ dùng cùng dữ liệu, CSS và bundle production. Không chèn delay, vòng lặp giả hay tải thư viện thừa để làm chậm bản trước. Bộ đếm chẩn đoán chỉ bật bằng `&debug`; các lần chạy Lighthouse không bật tham số này. Các bài thực hành cũ vẫn nằm ở `/`.

## 2. Phương pháp đo Lighthouse

Build bằng `npm run build`, phục vụ qua Vite preview tại `127.0.0.1:4173`. Chạy Lighthouse CLI **12.8.2**, Chrome headless **154.0.0.0**, trên cùng máy macOS. Đo lần lượt ba lượt trước rồi ba lượt sau, mỗi lượt Chrome dùng profile tạm riêng, không tái sử dụng cache trình duyệt; không chạy kiểm tra tương tác đồng thời.

Cấu hình chung: mobile 412 × 823, device scale factor 1,75; `throttlingMethod=simulate`, CPU slowdown ×4, RTT 150 ms, throughput 1.638,4 Kbps. Các giá trị Lighthouse là mô phỏng trong phòng thử nghiệm trên localhost, không phải số liệu người dùng thật. Lấy **trung vị từng chỉ số** trong ba lượt, không chọn riêng lượt tốt nhất.

Lệnh tái lập sau khi bật preview:

```bash
bash scripts/measure-performance.sh
```

Script chạy Lighthouse phiên bản cố định và xuất HTML/JSON; [summary.json](lighthouse/summary.json) lưu số liệu thô, thời gian, phiên bản Chrome và cấu hình đầy đủ. Thay đổi máy, trình duyệt hoặc tải CPU có thể làm thay đổi kết quả.

## 3. Vấn đề phát hiện trước tối ưu

Lượt trước số 1 có **100.053 DOM elements**, trong đó 10.000 dòng sản phẩm, được ghi trong audit `dom-size`. Audit `mainthread-work-breakdown` ghi nhận khoảng **2.416 ms** công việc trên main thread; riêng Style & Layout khoảng **1.212 ms**. TBT của ba lượt là 647,6–707,0 ms. Đây là bằng chứng cho thấy render toàn bộ danh sách gây chi phí DOM/layout đáng kể.

Kiểm tra tương tác bổ sung trên bản production có `&debug`: chỉ chọn một sản phẩm cũng gọi lại **10.000 component dòng** và tính lại phép lọc/sắp xếp **1 lần**, dù từ khóa, danh mục và thứ tự không đổi. Vì vậy memoization được áp dụng đúng vào các công việc lặp lại này.

## 4. Giải pháp đã áp dụng

### Kỹ thuật 1: Virtualization

Tự cài đặt windowing cho dòng cao cố định **68 px**, vùng cuộn **544 px**, vùng đệm **4 dòng mỗi phía**. Tính vị trí bắt đầu từ `scrollTop`, giữ spacer cao `số_kết_quả × 68`, và chỉ render lát cắt cần thiết.

Ở đầu danh sách chỉ mount **12 dòng**; khi cuộn ở giữa tối đa **16 dòng**, thay vì 10.000. Dữ liệu vẫn đủ 10.000 phần tử và có thể cuộn đến sản phẩm cuối cùng. Dùng `product.id` làm key; state chọn sản phẩm nằm ở component cha nên không mất khi dòng bị unmount. Giải pháp này giảm số component được tạo và DOM cần style/layout.

Giới hạn: chỉ phù hợp dòng cao cố định; nếu nội dung có chiều cao động cần đo kích thước hoặc dùng thư viện hỗ trợ. Browser Find chỉ tìm được các dòng đang mount; dùng ô tìm kiếm của trang để tìm toàn bộ dữ liệu.

### Kỹ thuật 2: Memoization

- `useMemo` lưu kết quả lọc/sắp xếp với dependencies `[query, category, sort]`; dữ liệu mock là hằng số ngoài component. Khi chọn/bỏ chọn hoặc cuộn, không lọc lại 10.000 phần tử.
- `React.memo(Row)` bỏ qua dòng có props không đổi. Truyền `selected` là boolean theo từng dòng, thay vì truyền cả Set lựa chọn xuống tất cả dòng.
- `useCallback` giữ tham chiếu callback chọn sản phẩm; dùng functional state update để không phụ thuộc Set hiện tại.

Sau tối ưu, chọn một sản phẩm chỉ render lại **1 dòng**, phép lọc/sắp xếp chạy thêm **0 lần**. Memoization hỗ trợ tương tác; không quy toàn bộ cải thiện Lighthouse tải trang cho memoization vì Lighthouse navigation không thao tác checkbox. Virtualization là giải pháp trực tiếp cho lượng DOM lớn khi tải trang.

## 5. Kết quả so sánh

| Chỉ số — trung vị 3 lượt | Trước | Sau | Nhận xét |
| --- | ---: | ---: | --- |
| Performance score | 83/100 | 100/100 | Tăng 17 điểm |
| FCP | 1.205,80 ms | 1.204,15 ms | Giảm 1,65 ms (~0,14%), không đáng kể |
| LCP | 1.356,02 ms | 1.354,15 ms | Giảm 1,87 ms (~0,14%), không đáng kể |
| TBT | 704,10 ms | 0 ms | Giảm 704,10 ms (100%) |
| CLS | 0 | 0 | Giữ ổn định, không có dịch chuyển được ghi nhận |

Hai chỉ số cải thiện rõ là **Performance score** và **TBT**. FCP/LCP gần như không đổi vì giao diện và tài nguyên ban đầu giống nhau; không coi chênh lệch nhỏ này là cải thiện có ý nghĩa. TBT bằng 0 trong cấu hình thử nghiệm không có nghĩa JavaScript không tốn thời gian hay ứng dụng không bao giờ bị lag.

### Tất cả các lượt đo

| Phiên bản | Lượt | Performance | FCP (ms) | LCP (ms) | TBT (ms) | CLS | Export HTML | JSON |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Trước | 1 | 83 | 1.206,02 | 1.356,02 | 707,00 | 0 | [HTML](lighthouse/before-1.report.html) | [JSON](lighthouse/before-1.report.json) |
| Trước | 2 | 84 | 1.205,74 | 1.355,74 | 647,57 | 0 | [HTML](lighthouse/before-2.report.html) | [JSON](lighthouse/before-2.report.json) |
| Trước | 3 | 83 | 1.205,80 | 1.356,85 | 704,10 | 0 | [HTML](lighthouse/before-3.report.html) | [JSON](lighthouse/before-3.report.json) |
| Sau | 1 | 100 | 1.204,15 | 1.354,15 | 0 | 0 | [HTML](lighthouse/after-1.report.html) | [JSON](lighthouse/after-1.report.json) |
| Sau | 2 | 100 | 1.203,78 | 1.353,78 | 0 | 0 | [HTML](lighthouse/after-2.report.html) | [JSON](lighthouse/after-2.report.json) |
| Sau | 3 | 100 | 1.204,91 | 1.354,91 | 0 | 0 | [HTML](lighthouse/after-3.report.html) | [JSON](lighthouse/after-3.report.json) |

## 6. Kiểm tra tính đúng đắn

`npm run build` thành công. Script [validate-performance.mjs](../scripts/validate-performance.mjs) kiểm tra cả hai chế độ trên Chrome production: mount đúng số dòng, số lần render/phép lọc khi chọn một dòng, cuộn đến sản phẩm 10.000, giữ lựa chọn khi cuộn đi rồi quay lại, tìm kiếm, lọc 2.500 sản phẩm/danh mục, sắp xếp giá, bỏ chọn và không tràn ngang ở mobile 390 px. Không phát hiện lỗi JavaScript.

Bằng chứng: [functional.json](validation/functional.json), [ảnh desktop trước](validation/before-desktop.png), [ảnh desktop sau](validation/after-desktop.png), [ảnh mobile sau](validation/after-mobile.png). Các ảnh được chụp sau khi kiểm tra sắp xếp giá tăng dần.

## 7. Kết luận và tài liệu

Trang đạt yêu cầu áp dụng ít nhất hai kỹ thuật phù hợp với vấn đề đã đo: virtualization giảm công việc khi mount danh sách dài; memoization giảm render và tính toán lặp lại khi tương tác. Đã lưu sáu export Lighthouse và bảng trung vị với Performance/TBT cải thiện rõ. Dữ liệu là giả lập; nếu đưa vào đồ án có API thật cần đo lại với dữ liệu, mạng và môi trường triển khai thực tế.

- [React — memo](https://react.dev/reference/react/memo)
- [React — useMemo](https://react.dev/reference/react/useMemo)
- [React — useCallback](https://react.dev/reference/react/useCallback)
- [Chrome — Lighthouse](https://developer.chrome.com/docs/devtools/lighthouse/)
- [Chrome — Total Blocking Time](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
