import { NextResponse } from "next/server";
import { auth } from "@/auth";

const authProxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role; // "DOCTOR" | "PATIENT"

  const isDoctorRoute = nextUrl.pathname.startsWith("/doctor");
  const isPatientDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isDoctorApi = nextUrl.pathname.startsWith("/api/doctor");
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. Doctor API Protection
  if (isDoctorApi) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden: Doctor access required" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // 2. Unauthenticated user trying to access protected dashboards
  if (!isLoggedIn) {
    if (isDoctorRoute || isPatientDashboard) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Authenticated user visiting /login or /register -> Redirect to their respective dashboard
  if (isAuthPage) {
    if (userRole === "DOCTOR") {
      return NextResponse.redirect(new URL("/doctor/dashboard", nextUrl.origin));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // 4. Role-Based Access Control (RBAC)
  // Patient trying to access /doctor/* -> Redirect to /dashboard
  if (isDoctorRoute && userRole !== "DOCTOR") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // Doctor trying to access /dashboard (Patient Portal) -> Redirect to /doctor/dashboard
  if (isPatientDashboard && userRole === "DOCTOR") {
    return NextResponse.redirect(new URL("/doctor/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export default authProxy;
export const proxy = authProxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/doctor/:path*",
    "/api/doctor/:path*",
    "/login",
    "/register",
  ],
};
