import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return Response.redirect(signInUrl);
    }

    // Handle users who are authenticated but trying to access auth pages
    if (auth.userId && ["/sign-in", "/sign-up"].includes(req.nextUrl.pathname)) {
      return Response.redirect(new URL("/(dashboard)/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|_vercel|[\\w-]+\\.\\w+).*)",
    "/"
  ]
}; 