import { LoginForm } from "./form";
export const metadata = { title: "Đăng nhập", robots: { index: false, follow: false } };
export default function Login() { return <section className="panel"><p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h1>Đăng nhập</h1><p>Tiếp tục hành trình học tập của bạn.</p><LoginForm githubEnabled={!!(process.env.GITHUB_ID && process.env.GITHUB_SECRET)} /></section>; }
