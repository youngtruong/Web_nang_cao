import "server-only";
import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Role } from "../types/next-auth";

// Provision accounts on the server. Never accept a role from a form or OAuth profile.
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID ?? "", clientSecret: process.env.GITHUB_SECRET ?? "" }),
    Credentials({
      name: "Email và mật khẩu",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Mật khẩu", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || credentials.password.length > 128) return null;
        const email = credentials.email.trim().toLowerCase();
        const accounts = [
          { id: "local-admin", email: process.env.ADMIN_EMAIL, hash: process.env.ADMIN_PASSWORD_HASH, role: "admin" as const },
          { id: "local-user", email: process.env.USER_EMAIL, hash: process.env.USER_PASSWORD_HASH, role: "user" as const },
        ];
        const account = accounts.find(a => a.email?.toLowerCase() === email);
        // Always perform a hash comparison, including unknown accounts.
        const valid = await compare(credentials.password, account?.hash || "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW");
        if (!account?.hash || !valid) return null;
        return { id: account.id, email, name: account.role === "admin" ? "Quản trị viên" : "Thành viên", role: account.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) { token.id = user.id; token.role = account?.provider === "credentials" ? user.role : "user"; }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role === "admin" ? "admin" : "user";
      return session;
    },
  },
};
export async function requireRole(role?: Role) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (role && session.user.role !== role) redirect("/forbidden");
  return session;
}
