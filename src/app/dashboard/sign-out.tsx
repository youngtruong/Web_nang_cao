"use client";
import { signOut } from "next-auth/react";
export function SignOut() { return <button onClick={() => void signOut({ callbackUrl: "/" })}>Đăng xuất</button>; }
