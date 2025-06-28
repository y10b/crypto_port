import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDailyCandle } from "@/lib/upbit";

const MARKETS = [
  "KRW-BTC",
  "KRW-ETH",
  "KRW-SOL",
  "KRW-XRP",
  "KRW-ADA",
  "KRW-DOGE",
  "KRW-PEPE",
  "KRW-TRUMP",
  "KRW-AVAX",
  "KRW-MATIC",
  "KRW-DOT",
  "KRW-LINK",
];

export async function POST() {
  const today = new Date();

  for (const market of MARKETS) {
    try {
      const [candle] = await getDailyCandle(market, today);
      const date = new Date(candle.candle_date_time_kst);

      await prisma.priceDaily.upsert({
        where: { market_date: { market, date } },
        create: {
          market,
          date,
          open: candle.opening_price,
          high: candle.high_price,
          low: candle.low_price,
          close: candle.trade_price,
          volume: candle.candle_acc_trade_volume,
        },
        update: {
          close: candle.trade_price,
        },
      });
    } catch (err) {
      console.error("cron error", market, err);
    }
  }

  return NextResponse.json({ ok: true });
}
