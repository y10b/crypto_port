"use client";
import ParamForm, { ParamValues } from "@/components/ParamForm";
import { ResultChart } from "@/components/ResultChart";
import { useState } from "react";

export default function HomePage() {
  const [datasets, setDatasets] = useState<
    { label: string; data: { date: string; evalPrice: number }[] }[]
  >([]);
  const [enabled, setEnabled] = useState<string[]>([]);

  async function handleSubmit(params: ParamValues) {
    const query = new URLSearchParams({
      markets: params.markets.join(","),
      amount: params.amount,
      period: params.period,
    }).toString();

    const res = await fetch(`/api/simulate?${query}`, { cache: "no-store" });
    const json = await res.json();

    const newData: {
      label: string;
      data: { date: string; evalPrice: number }[];
    }[] = [];
    type SimResponse = { timeline: { date: string; evalPrice: number }[] };
    for (const [label, result] of Object.entries(json) as [
      string,
      SimResponse
    ][]) {
      newData.push({
        label,
        data: result.timeline.map((t) => ({
          date: t.date,
          evalPrice: t.evalPrice,
        })),
      });
    }
    setDatasets(newData);
    setEnabled(params.markets);
  }

  function toggleTicker(ticker: string) {
    setEnabled((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker]
    );
  }

  return (
    <main className="container mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold">가상자산 적금 투자 시뮬레이터</h1>
      <ParamForm onSubmit={handleSubmit} />

      {datasets.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {datasets.map((d) => {
              const active = enabled.includes(d.label);
              return (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => toggleTicker(d.label)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {d.label.replace("KRW-", "")}
                </button>
              );
            })}
          </div>

          <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur p-6 rounded-3xl shadow-lg">
            <ResultChart dataSets={datasets} enabled={enabled} />
          </div>
        </div>
      )}
    </main>
  );
}
