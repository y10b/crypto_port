import { prisma } from "../src/lib/prisma";
import { getDailyCandle } from "../src/lib/upbit";

// 수집할 마켓 코드 배열
const MARKETS = ["KRW-BTC", "KRW-ETH", "KRW-SOL"];

async function main() {
  const now = new Date();
  for (const market of MARKETS) {
    try {
      const [candle] = await getDailyCandle(market, now);
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
      console.log(`[${market}] saved ${date.toISOString().slice(0, 10)}`);
    } catch (err) {
      console.error("save error", err);
    }
  }
}

if (require.main === module) {
  main().then(() => prisma.$disconnect());
}
