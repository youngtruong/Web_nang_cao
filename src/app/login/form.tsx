"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
export function LoginForm({ githubEnabled }: { githubEnabled: boolean }) {
  const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  return <><form onSubmit={async e => { e.preventDefault(); setPending(true); setError(""); const form = new FormData(e.currentTarget); try { const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false, callbackUrl: "/dashboard" }); if (result?.ok) window.location.assign("/dashboard"); else setError("Email hoặc mật khẩu không đúng."); } catch { setError("Không thể đăng nhập. Vui lòng thử lại."); } finally { setPending(false); } }}><label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label><p role="alert">{error}</p><button disabled={pending}>{pending ? "Đang đăng nhập…" : "Đăng nhập bằng email"}</button></form><button className="secondary" disabled={!githubEnabled || pending} onClick={() => void signIn("github", { callbackUrl: "/dashboard" })}>Đăng nhập với GitHub</button>{!githubEnabled && <p>Cần cấu hình GitHub OAuth trên server để sử dụng.</p>}</>;
}
