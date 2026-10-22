import { requireRole } from "../../../lib/auth";
import { SignOut } from "./sign-out";
export const metadata = { title: "Tài khoản", robots: { index: false, follow: false } };
export default async function Dashboard() { const { user } = await requireRole(); return <section className="panel"><p className="eyebrow">KHÔNG GIAN CÁ NHÂN</p><h1>Xin chào, {user.name}</h1><p>{user.email}</p><p>Vai trò: <strong>{user.role}</strong></p><SignOut /></section>; }
