import Link from "next/link";
export default function Forbidden() { return <section className="panel"><h1>Không có quyền truy cập</h1><p>Tài khoản của bạn không có quyền quản trị.</p><Link href="/dashboard">Về tài khoản</Link></section>; }
