// middleware.ts or middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token'); // Read the token from cookies (preferred for secure storage)
    const { pathname } = request.nextUrl;

    // Redirect to /sign-in if no token and accessing a protected route
    if (!token && pathname !== '/sign-in' && pathname !== '/sign-up') {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect to home if token exists and accessing auth pages
    if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|static|favicon.ico).*)'], // Apply to all pages except API, static files, and Next.js internals
};
