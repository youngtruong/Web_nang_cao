# Starter Base Project - Lập Trình Web Nâng Cao

Khung dự án Single Page Application (SPA) tinh gọn xây dựng bằng **React + TypeScript + Vite + Tailwind CSS**.

---

## 🛠️ Công nghệ cốt lõi

- **Core**: React 18 + TypeScript (Strict Mode)
- **Build Tool**: Vite (Cấu hình alias `@/*` trỏ về `src/`)
- **Styling**: Tailwind CSS v3 + Lucide Icons
- **Routing**: React Router DOM v6
- **Global State**: Zustand
- **Server State**: TanStack React Query
- **HTTP Client**: Axios (Cấu hình Base URL + Interceptors)

---

## 📁 Cấu trúc thư mục (`src/`)

```
src/
├── assets/          # Static assets (hình ảnh, icons)
├── components/      # UI components tái sử dụng (Button, Input, Card, Navbar,...)
├── hooks/           # Custom React hooks (useDebounce,...)
├── layouts/         # Layout wrapper (MainLayout,...)
├── pages/           # Các trang giao diện (HomePage, NotFoundPage,...)
├── routes/          # Cấu hình Router (AppRoutes)
├── services/        # Tầng kết nối API (apiClient)
├── store/           # Global State Zustand (useThemeStore,...)
├── types/           # Định nghĩa TypeScript Interfaces & Types
├── utils/           # Helper functions (cn.ts)
├── App.tsx          # Component gốc gắn Providers
├── main.tsx         # Entry point render DOM
└── index.css        # Tailwind directives & CSS
```

---

## 🚀 Khởi chạy dự án

1. **Khởi chạy môi trường phát triển:**
   ```bash
   npm run dev
   ```
   *Mở trình duyệt:* `http://localhost:3000`

2. **Kiểm tra build sản phẩm:**
   ```bash
   npm run build
   ```

## Nhận xét: Zustand so với Redux Toolkit

- Zustand cần rất ít mã cấu hình, nên phù hợp với state yêu thích nhỏ và độc lập.
- Component có thể dùng store trực tiếp mà không cần Provider, slice hay action creator.
- Selector của Zustand giúp component chỉ đăng ký phần state cần dùng.
- Redux Toolkit có cấu trúc và luồng action rõ ràng hơn khi nghiệp vụ phát triển phức tạp.
- Redux DevTools và middleware của Redux Toolkit thuận tiện hơn cho việc theo dõi, kiểm tra luồng cập nhật.
- Với tính năng này, Zustand gọn hơn; nếu cần xử lý bất đồng bộ và nhiều state liên quan, Redux Toolkit dễ mở rộng hơn.

## Buổi 5 — Tối ưu hiệu năng React

Trang quản lý **10.000 sản phẩm giả lập cố định**, hỗ trợ tìm kiếm, lọc danh mục, sắp xếp giá và chọn sản phẩm.

```bash
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

- Trước tối ưu: http://127.0.0.1:4173/performance.html?mode=before
- Sau tối ưu: http://127.0.0.1:4173/performance.html?mode=after
- Báo cáo: [reports/BAO_CAO_HIEU_NANG.md](reports/BAO_CAO_HIEU_NANG.md)
- Export Lighthouse HTML/JSON: `reports/lighthouse/` (3 lượt mỗi phiên bản).
- Đo lại, khi preview đang chạy: `bash scripts/measure-performance.sh` (cần Chrome và mạng để tải Lighthouse 12.8.2).

Hai kỹ thuật chính: virtualization với dòng cao cố định và memoization (`React.memo`, `useMemo`, `useCallback`). Hai phiên bản dùng chung dữ liệu, giao diện, bundle và cấu hình đo; không chèn delay để làm chậm bản trước. Trang này là entry riêng, các bài thực hành trước vẫn ở `/`.

Kiểm tra tương tác bằng Puppeteer đi kèm Lighthouse:

```bash
node scripts/validate-performance.mjs /duong-dan/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js
```

Script này chạy trên bản production ở port 4173, lưu kết quả và ảnh desktop/mobile trong `reports/validation/`. Tham số `&debug` bật bộ đếm render/phép lọc, không dùng trong Lighthouse.
