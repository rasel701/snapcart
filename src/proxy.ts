import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/login", "/register", "/favicon.ico"];

  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Req Url ", req.url);
  console.log("token ", token);
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    console.log(loginUrl);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role;

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/delivery") && role !== "delivery") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ১. পাবলিক রুট এবং স্ট্যাটিক ফাইল চেক (হোমপেজ '/' যদি পাবলিক হয় তবে এখানে যোগ করুন)
//   const isPublicRoute = ["/login", "/register", "/", "/favicon.ico"].includes(
//     pathname,
//   );
//   const isAuthRoute = pathname.startsWith("/api/auth");

//   if (isPublicRoute || isAuthRoute) {
//     return NextResponse.next();
//   }

//   // ২. টোকেন সংগ্রহ
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });

//   // ৩. টোকেন না থাকলে লগইন পেজে পাঠানো
//   if (!token) {
//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   const role = token.role as string;

//   // ৪. রোল অনুযায়ী পারমিশন চেক (লজিক আরও ক্লিন করা হয়েছে)
//   if (pathname.startsWith("/user") && role !== "user") {
//     return NextResponse.rewrite(new URL("/unauthorized", req.url));
//   }

//   if (pathname.startsWith("/delivery") && role !== "delivery") {
//     return NextResponse.rewrite(new URL("/unauthorized", req.url));
//   }

//   if (pathname.startsWith("/admin") && role !== "admin") {
//     return NextResponse.rewrite(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// // ৫. ম্যাচিং কন্ডিশন (অপ্রয়োজনীয় ফাইল ফিল্টার আউট করা)
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
// };
