import { requireRole } from "../../../lib/auth";
import { runAdminCheck } from "./actions";
export const metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export default async function Admin({ searchParams }: { searchParams: Promise<{ checked?: string }> }) { await requireRole("admin"); const params = await searchParams; return <section className="panel"><p className="eyebrow">CHỈ DÀNH CHO ADMIN</p><h1>Quản trị hệ thống</h1><p>Thao tác dưới đây xác minh quyền quản trị tại Server Action.</p><form action={runAdminCheck}><button>Kiểm tra quyền trên server</button></form>{params.checked === "1" && <p role="status">Đã xác minh quyền admin thành công.</p>}</section>; }
