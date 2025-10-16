
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("Token");
  const { pathname } = request.nextUrl;

  if (token) {
    if (pathname === "/auth") {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }
  } 
  else {
    // Redirect all routes starting with "/" (except /auth) to /auth
    if (pathname.startsWith("/") && !pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
    }
  }
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"],
};




//  cookies: RequestCookies {"ext_name":{"name":"ext_name","value":"ojplmecpdpgccookcobabopnaifgidhf"},"redirectUrl":{"name":"redirectUrl","value":"https://www.amazon.in/"},"__next_hmr_refresh_hash__":{"name":"__next_hmr_refresh_hash__","value":"79"}},
//   nextUrl: {
//   href: 'http://localhost:3000/auth',
//   origin: 'http://localhost:3000',
//   protocol: 'http:',
//   username: '',
//   password: '',
//   host: 'localhost:3000',
//   hostname: 'localhost',
//   port: '3000',
//   pathname: '/auth',
//   search: '',
//   searchParams: URLSearchParams {  },
//   hash: ''
// },
//   url: 'http://localhost:3000/auth',
//   bodyUsed: false,
//   cache: 'default',
//   credentials: 'same-origin',
//   destination: '',
//   headers: {