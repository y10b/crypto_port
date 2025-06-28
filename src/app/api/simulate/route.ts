import { NextRequest, NextResponse } from "next/server";
import { simulate } from "@/lib/simulator";
import { Period } from "@prisma/client";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const marketsParam = sp.get("markets");
  const amount = Number(sp.get("amount"));
  const period = sp.get("period") as Period | null;

  if (!marketsParam || !amount || !period) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const markets = marketsParam
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const results: Record<string, unknown> = {};

  await Promise.all(
    markets.map(async (m) => {
      results[m] = await simulate({ market: m, amount, period });
    })
  );

  return NextResponse.json(results, { status: 200 });
}
