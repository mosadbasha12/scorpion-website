import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const valid = isValidSession(cookies().get(SESSION_COOKIE)?.value);
  return NextResponse.json({ authenticated: valid }, { status: valid ? 200 : 401 });
}
