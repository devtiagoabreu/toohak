import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const path = req.nextUrl.pathname;
    const isAuthPage = path.startsWith("/auth");
    const isProtectedApp =
      path.startsWith("/dashboard") ||
      path.startsWith("/create") ||
      path.startsWith("/library") ||
      path.startsWith("/courses") ||
      path.startsWith("/reports") ||
      path.startsWith("/present") ||
      path.startsWith("/settings");

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/library", req.url));
    }

    if (isProtectedApp && !isAuth) {
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/create/:path*", "/library/:path*", "/courses/:path*", "/reports/:path*", "/present/:path*", "/settings/:path*"],
};
