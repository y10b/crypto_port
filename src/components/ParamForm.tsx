"use client";
import { useState } from "react";

const TICKERS = [
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
      className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-slate-700/50 space-y-8"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-200">🪙</span>
          <span className="text-lg font-semibold text-slate-200">
            코인 선택
          </span>
          <span className="text-sm text-slate-400">(여러 개 선택 가능)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {TICKERS.map((t) => {
            const active = form.markets.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleMarket(t)}
                className={`px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium text-sm ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-slate-800/50 text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 hover:scale-102"
                }`}
              >
                {t.replace("KRW-", "")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <label className="text-lg font-semibold text-slate-200">
              회차당 금액
            </label>
          </div>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="10000"
            className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-400 transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <label className="text-lg font-semibold text-slate-200">
              투자 주기
            </label>
          </div>
          <select
            name="period"
            value={form.period}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-200 transition-all duration-200"
          >
            <option value="DAILY">매일 투자</option>
            <option value="WEEKLY">매주 투자</option>
            <option value="MONTHLY">매월 투자</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={form.markets.length === 0}
        className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        🚀 시뮬레이션 실행
      </button>
    </form>
  );
}
