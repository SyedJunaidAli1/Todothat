import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// Skip protection for auth routes
	const publicPaths = ["/signin", "/signup", "/forgot-password", "/reset-password", "/terms", "/auth-illustration.png", "/about", "/privacy"];
	const isPublicPath = publicPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

	if (!sessionCookie && !isPublicPath) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	return NextResponse.next();
}

// Match all paths except _next, static files, API, and public auth routes
export const config = {
	matcher: ["/((?!_next|static|api|favicon.ico|signin|signup|forgot-password|reset-password).*)"],
};
