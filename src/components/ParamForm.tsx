"use client";
import { useState } from "react";

const TICKERS = ["KRW-BTC", "KRW-ETH", "KRW-SOL", "KRW-XRP", "KRW-ADA"];

export interface ParamValues {
  markets: string[];
  amount: string;
  period: "DAILY" | "WEEKLY" | "MONTHLY";
}

export default function ParamForm({
  onSubmit,
}: {
  onSubmit: (params: ParamValues) => void;
}) {
  const [form, setForm] = useState<ParamValues>({
    markets: ["KRW-BTC"],
    amount: "10000",
    period: "DAILY",
  });

  function toggleMarket(market: string) {
    setForm((s) => {
      const exists = s.markets.includes(market);
      return {
        ...s,
        markets: exists
          ? s.markets.filter((m) => m !== market)
          : [...s.markets, market],
      };
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (form.markets.length === 0) return;
        onSubmit(form);
      }}
      className="grid gap-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur p-6 rounded-3xl shadow-lg"
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium mb-1">코인 선택 (여러 개)</span>
        <div className="flex flex-wrap gap-2">
          {TICKERS.map((t) => {
            const active = form.markets.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleMarket(t)}
                className={`px-4 py-2 rounded-full border transition ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent text-gray-700 dark:text-gray-200"
                }`}
              >
                {t.replace("KRW-", "")}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">회차당 금액(₩)</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">주기</label>
        <select
          name="period"
          value={form.period}
          onChange={handleChange}
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DAILY">매일</option>
          <option value="WEEKLY">매주</option>
          <option value="MONTHLY">매월</option>
        </select>
      </div>
      <button
        type="submit"
        className="col-span-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-full hover:opacity-90 transition"
      >
        시뮬레이션 실행
      </button>
    </form>
  );
}
