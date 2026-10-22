"use server";
import { requireRole } from "../../../lib/auth";
import { redirect } from "next/navigation";
export async function runAdminCheck() {
  // This check is required even when called directly, bypassing the page UI.
  await requireRole("admin");
  redirect("/admin?checked=1");
}
