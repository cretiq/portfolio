import { NextResponse } from "next/server"

const UPSTREAM = "https://sl-quick-server.fly.dev/api/shapes"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ routeId: string }> }
) {
  const { routeId } = await params
  const res = await fetch(`${UPSTREAM}/${routeId}`)
  const data = await res.json()
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  })
}
