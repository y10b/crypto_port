const BASE_URL = "https://api.upbit.com/v1";

export async function getDailyCandle(market: string, to: Date, count = 1) {
  const iso = to.toISOString();
  const url = `${BASE_URL}/candles/days?market=${market}&to=${iso}&count=${count}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    // Next.js fetch 캐시 재검증 옵션 (SSG/RSC)
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Upbit candle fetch failed");
  return (await res.json()) as any[];
}

export async function getTicker(markets: string[]) {
  const url = `${BASE_URL}/ticker?markets=${markets.join(",")}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 5 },
  });
  if (!res.ok) throw new Error("Upbit ticker fetch failed");
  return (await res.json()) as any[];
}
