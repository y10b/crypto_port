import { prisma } from "../src/lib/prisma";
import { getDailyCandle } from "../src/lib/upbit";
import { subDays } from "date-fns";

const MARKETS =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
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

const BATCH = 200;

async function backfillMarket(market: string) {
  console.log(`⏳ Backfilling ${market}`);
  let cursor = new Date(); // start from today
  let total = 0;

  while (true) {
    const candles = await getDailyCandle(market, cursor, BATCH);
    if (!Array.isArray(candles) || candles.length === 0) break;

    // Upbit returns 최근→과거 순서. reverse to oldest first for stable insertion
    candles.reverse();

    for (const c of candles) {
      const date = new Date(c.candle_date_time_kst);
      await prisma.priceDaily.upsert({
        where: { market_date: { market, date } },
        create: {
          market,
          date,
          open: c.opening_price,
          high: c.high_price,
          low: c.low_price,
          close: c.trade_price,
          volume: c.candle_acc_trade_volume,
        },
        update: {},
      });
      total++;
    }

    console.log(
      `  inserted ${candles.length} (total ${total}) ... oldest ${candles[0].candle_date_time_kst}`
    );

    if (candles.length < BATCH) break; // reached inception

    const oldest = new Date(candles[0].candle_date_time_kst);
    cursor = subDays(oldest, 1); // move cursor one day earlier
  }
  console.log(`✅ ${market} backfill complete. rows: ${total}`);
}

async function main() {
  for (const m of MARKETS) {
    try {
      await backfillMarket(m);
    } catch (err) {
      console.error("error", err);
    }
  }
}

if (require.main === module) {
  main().then(() => prisma.$disconnect());
}
