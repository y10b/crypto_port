const BASE_URL = "https://api.upbit.com/v1";

export interface DayCandle {
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  candle_acc_trade_volume: number;
}

export async function getDailyCandle(
  market: string,
  to: Date,
  count = 1
): Promise<DayCandle[]> {
  const iso = to.toISOString();
  const url = `${BASE_URL}/candles/days?market=${market}&to=${iso}&count=${count}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    // Next.js fetch 캐시 재검증 옵션 (SSG/RSC)
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Upbit candle fetch failed");
  const data = (await res.json()) as DayCandle[];
  return data;
}

export interface TickerInfo {
  market: string;
  trade_price: number;
  signed_change_rate: number;
  acc_trade_price_24h: number;
}

export async function getTicker(markets: string[]): Promise<TickerInfo[]> {
  const url = `${BASE_URL}/ticker?markets=${markets.join(",")}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 5 },
  });
  if (!res.ok) throw new Error("Upbit ticker fetch failed");
  const data = (await res.json()) as TickerInfo[];
  return data;
}
