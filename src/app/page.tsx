import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, siteUrl } from "../../lib/seo";
export const metadata: Metadata = { title: "Trang chủ", alternates: { canonical: "/" }, openGraph: { title: "Web nâng cao", description: "Từ React đến ứng dụng Next.js an toàn và dễ tìm kiếm.", url: "/", locale: "vi_VN", type: "website" } };
export default function Home() {
  return <><JsonLd value={{ "@context": "https://schema.org", "@type": "WebSite", name: "Web nâng cao", url: siteUrl }} /><section className="hero"><p className="eyebrow">THỰC HÀNH · KHÁM PHÁ · XÂY DỰNG</p><h1>Kiến thức web.<br />Trải nghiệm thực tế.</h1><p>Khám phá React và Next.js qua những bài thực hành về giao diện, hiệu năng và bảo mật.</p><Link className="button" href="/dashboard">Vào không gian học tập →</Link></section><section className="grid"><article><span>01 / NỀN TẢNG</span><h2>Giao diện tương tác</h2><p>Context, Redux và các component có thể tái sử dụng.</p></article><article><span>02 / BẢO MẬT</span><h2>Tài khoản của bạn</h2><p>Đăng nhập bằng GitHub hoặc email, truy cập theo vai trò.</p></article><article><span>03 / KHÁM PHÁ</span><h2>Web dễ tìm kiếm</h2><p>Nội dung được render trên server, sẵn sàng cho công cụ tìm kiếm.</p><Link href="/about">Tìm hiểu dự án →</Link></article></section></>;
}
