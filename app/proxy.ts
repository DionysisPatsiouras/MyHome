import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

const protectedRoutes = ['/dashboard']

export default async function proxy(req: NextRequest) {

    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)

    const token: string | undefined = (await cookies())?.get('token')?.value


    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl))
        }

        const SECRET_KEY = String(process.env.SECRET_KEY)
        try {
            // 4. Verify JWT
            // const decoded = jwt.verify(token, SECRET_KEY)
            jwt.verify(token, SECRET_KEY)
            // console.log("🚀 Token decoded:", decoded)
            // Allow access if valid
            return NextResponse.next()
        } catch (err) {
            console.log("🚨 Invalid token:", err)
            return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl))
        }
    }
    return NextResponse.next()
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}