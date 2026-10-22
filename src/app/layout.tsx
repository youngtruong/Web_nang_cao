import type { Metadata } from "next";
import Link from "next/link";
import "./style.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "Web nâng cao", template: "%s | Web nâng cao" },
  description: "Thực hành React và Next.js: xác thực, phân quyền và tối ưu trải nghiệm web.",
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><header><Link href="/" className="brand">W / Web nâng cao</Link><nav aria-label="Điều hướng chính"><Link href="/about">Giới thiệu</Link><Link href="/dashboard">Tài khoản</Link><Link href="/admin">Quản trị</Link><Link href="/login">Đăng nhập</Link></nav></header><main>{children}</main><footer>Web nâng cao · Học qua thực hành</footer></body></html>;
}
