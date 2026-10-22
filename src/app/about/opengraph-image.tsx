import { ImageResponse } from "next/og";
export const alt = "Hoc qua thuc hanh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#183e32", color: "#f6f7f2", fontSize: 80 }}><div>Hoc qua thuc hanh</div><div style={{ fontSize: 32, marginTop: 32 }}>React · Next.js · Web Development</div></div>, size); }
