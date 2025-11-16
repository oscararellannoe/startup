import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const authRoutes = ["/login", "/signup", "/reset-password", "/update-password"];
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtected = pathname.startsWith("/dashboard");

  if (!session && isProtected) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/login", "/signup", "/reset-password", "/update-password", "/dashboard/:path*"],
};
