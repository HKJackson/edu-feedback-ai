export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/teacher/:path*", "/parent/:path*"],
};
