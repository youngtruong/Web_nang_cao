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
