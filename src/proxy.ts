import { NextResponse } from "next/server";

// すべての応答にセキュリティ用のヘッダーを付ける（Next.js 16 で middleware から proxy に名前が変わった）
export function proxy() {
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export const config = {
  matcher: "/:path*"
};
