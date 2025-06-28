"use client";
import ParamForm, { ParamValues } from "@/components/ParamForm";
import { ResultChart } from "@/components/ResultChart";
import { useState } from "react";

// 코인 이름 매핑
const COIN_NAMES: Record<string, string> = {
  "KRW-BTC": "비트코인",
  "KRW-ETH": "이더리움",
  "KRW-SOL": "솔라나",
  "KRW-XRP": "리플",
  "KRW-ADA": "에이다",
  "KRW-DOGE": "도지코인",
  "KRW-PEPE": "페페",
  "KRW-TRUMP": "트럼프",
  "KRW-AVAX": "아발란체",
  "KRW-MATIC": "폴리곤",
  "KRW-DOT": "폴카닷",
  "KRW-LINK": "체인링크",
};

export default function HomePage() {
  const [datasets, setDatasets] = useState<
    {
      label: string;
      data: {
        date: string;
        value: number;
        type: "evaluation" | "investment";
      }[];
    }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { label: string; roi: number; invested: number; evalPrice: number }[]
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
      data: {
        date: string;
        value: number;
        type: "evaluation" | "investment";
      }[];
    }[] = [];
    const newSummaries: {
      label: string;
      roi: number;
      invested: number;
      evalPrice: number;
    }[] = [];
    type SimResponse = {
      timeline: {
        date: string;
        evalPrice: number;
        cost: number;
        roi: number;
      }[];
      final: { roi: number; cost: number; evalPrice: number } | null;
      investmentTimeline: {
        date: string;
        cost: number;
      }[];
    };
    const pushDataset = (
      label: string,
      arr: { date: string; value: number; type: "evaluation" | "investment" }[]
    ) => {
      newData.push({ label, data: arr });
    };

    let investmentData: { date: string; value: number; type: "investment" }[] =
      [];

    for (const [label, result] of Object.entries(json) as [
      string,
      SimResponse
    ][]) {
      // 평가금액 데이터 (실선) - 코인 이름으로 표시
      const coinName = COIN_NAMES[label] || label.replace("KRW-", "");
      const evalSeries = result.timeline.map((t) => ({
        date: t.date,
        value: t.evalPrice, // 실제 평가금액
        type: "evaluation" as const,
      }));
      pushDataset(coinName, evalSeries);

      // 투자금 데이터는 첫 번째 코인에서만 생성 (모든 코인이 동일하므로)
      if (
        investmentData.length === 0 &&
        result.investmentTimeline &&
        result.investmentTimeline.length > 0
      ) {
        investmentData = result.investmentTimeline.map((t) => ({
          date: t.date,
          value: t.cost, // 실제 누적 투자금액
          type: "investment" as const,
        }));
        pushDataset("투자금", investmentData);
      }

      if (result.final)
        newSummaries.push({
          label,
          roi: result.final.roi,
          invested: result.final.cost,
          evalPrice: result.final.evalPrice,
        });
    }
    setDatasets(newData);
    setSummaries(newSummaries);
    // 초기 상태에서 선택된 코인들과 투자금 모두 활성화
    const coinNames = params.markets.map(
      (market) => COIN_NAMES[market] || market.replace("KRW-", "")
    );
    const initialEnabled = [...coinNames, "투자금"];
    setEnabled(initialEnabled);
  }

  function toggleTicker(ticker: string) {
    setEnabled((prev) => {
      const isCurrentlyEnabled = prev.includes(ticker);

      if (isCurrentlyEnabled) {
        // 비활성화: 해당 코인만 제거 (투자금은 항상 유지)
        return prev.filter((t) => t !== ticker);
      } else {
        // 활성화: 해당 코인 추가
        return [...prev, ticker];
      }
    });
  }

  return (
    <main className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
          가상자산 적금 투자 시뮬레이터
        </h1>
        <p className="text-slate-400 text-lg">
          과거 데이터로 검증하는 스마트한 투자 전략
        </p>
      </div>

      <ParamForm onSubmit={handleSubmit} />

      {datasets.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {datasets
              .filter((d) => d.label !== "투자금")
              .map((d) => {
                const active = enabled.includes(d.label);
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => toggleTicker(d.label)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-all duration-200 font-medium ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/25"
                        : "bg-slate-800/50 text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
          </div>

          {summaries.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {summaries.map((s) => (
                <div
                  key={s.label}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-bold text-slate-200">
                      {COIN_NAMES[s.label] || s.label.replace("KRW-", "")}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">투자금:</span>
                        <span className="text-slate-300 font-medium">
                          ₩{Intl.NumberFormat("ko-KR").format(s.invested)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">평가금:</span>
                        <span className="text-slate-300 font-medium">
                          ₩{Intl.NumberFormat("ko-KR").format(s.evalPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                      <p
                        className={`text-2xl font-bold ${
                          s.roi >= 0
                            ? "text-emerald-400 drop-shadow-sm"
                            : "text-red-400 drop-shadow-sm"
                        }`}
                      >
                        {s.roi >= 0 ? "+" : ""}
                        {(s.roi * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-slate-700/50">
            <ResultChart dataSets={datasets} enabled={enabled} />
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/30">
            <p className="text-sm text-slate-300 leading-relaxed">
              💡 <strong className="text-slate-200">차트 해석 가이드:</strong>{" "}
              <span className="text-emerald-400">실선</span>은 각 코인별 적립식
              매수 시<strong className="text-slate-200"> 총 평가금액</strong>을
              보여줍니다. <span className="text-blue-400">점선</span>은 같은
              기간 동안 투입된{" "}
              <strong className="text-slate-200">누적 투자금액</strong>을
              나타냅니다. 실선이 점선보다 높으면 수익, 낮으면 손실 구간입니다.
              두 선의 차이가 실제 수익금액을 의미합니다! 📊
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
