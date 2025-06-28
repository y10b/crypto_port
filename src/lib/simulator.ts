import { differenceInDays, differenceInMonths } from "date-fns";
import { prisma } from "./prisma";
import type { Period } from "@prisma/client";

export async function simulate(params: {
  market: string;
  amount: number;
  period: Period;
}) {
  const { market, amount, period } = params;

  // 가격 데이터(과거→현재) 전부 조회
  const priceRows = await prisma.priceDaily.findMany({
    where: { market },
    orderBy: { date: "asc" },
  });

  if (priceRows.length === 0) return { timeline: [], final: null };

  const timeline: {
    date: Date;
    cost: number;
    qty: number;
    evalPrice: number;
    roi: number;
  }[] = [];

  let cost = 0;
  let qty = 0;
  let lastBuy: Date | null = null;

  for (const row of priceRows) {
    const shouldBuy = (() => {
      if (!lastBuy) return true;
      switch (period) {
        case "DAILY":
          return true;
        case "WEEKLY":
          return differenceInDays(row.date, lastBuy) >= 7;
        case "MONTHLY":
          return differenceInMonths(row.date, lastBuy) >= 1;
      }
    })();

    if (!shouldBuy) continue;

    // 매수 처리
    const buyQty = amount / row.close;
    qty += buyQty;
    cost += amount;
    const evalPrice = row.close * qty;
    const roi = (evalPrice - cost) / cost;
    timeline.push({ date: row.date, cost, qty, evalPrice, roi });
    lastBuy = row.date;
  }

  return { timeline, final: timeline.at(-1) ?? null };
}
