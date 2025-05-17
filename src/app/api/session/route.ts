
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function GET() {
  const _headers = await headers()
  const session = await auth.api.getSession({
    headers: _headers,
  });

  return Response.json({ session });
}