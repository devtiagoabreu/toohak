import { NextRequest, NextResponse } from "next/server";

function buildQuery(q: string) {
  return encodeURIComponent((q || "").trim().slice(0, 120));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const query = buildQuery(q);
  if (!query) return NextResponse.json({ google: "", googleImages: "", pinterest: "" });
  return NextResponse.json({
    google: `https://www.google.com/search?q=${query}`,
    googleImages: `https://www.google.com/search?tbm=isch&q=${query}`,
    pinterest: `https://www.pinterest.com/search/pins/?q=${query}`,
  });
}
