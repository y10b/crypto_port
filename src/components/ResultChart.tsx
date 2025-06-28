"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

export interface TimelinePoint {
  date: string | Date;
  value: number;
  type: "evaluation" | "investment";
}

interface ChartProps {
  dataSets: { label: string; data: TimelinePoint[] }[];
  enabled?: string[];
}

export function ResultChart({ dataSets, enabled }: ChartProps) {
  if (dataSets.length === 0) return null;

  const labels = dataSets[0].data.map((d) =>
    format(new Date(d.date), "yyyy-MM-dd")
  );

  const chartData = {
    labels,
    datasets: dataSets.map((set, idx) => {
      const isInvestment = set.label === "투자금";
      const baseHue = (idx * 60) % 360;
      const hue = isInvestment ? (baseHue + 30) % 360 : baseHue;
      const border = `hsl(${hue}, 70%, ${isInvestment ? 60 : 50}%)`;
      const bg = (context: any) => {
        if (isInvestment) return "transparent"; // 투자금은 배경 없음
        const { ctx, chartArea } = context.chart as {
          ctx: CanvasRenderingContext2D;
          chartArea: any;
        };
        if (!chartArea) return border;
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );
        gradient.addColorStop(0, `hsla(${hue},70%,50%,0.4)`);
        gradient.addColorStop(1, `hsla(${hue},70%,50%,0.05)`);
        return gradient;
      };
      return {
        label: set.label,
        data: set.data.map((d) => d.value),
        borderColor: border,
        backgroundColor: bg,
        pointRadius: 0,
        fill: !isInvestment, // 투자금은 fill 하지 않음
        tension: 0.4,
        borderDash: isInvestment ? [5, 5] : [], // 투자금은 점선
        borderWidth: isInvestment ? 2 : 3,
        hidden: enabled ? !enabled.includes(set.label) : false,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#cbd5e1",
          font: { size: 12, weight: "bold" as const },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle" as const,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const raw = Number(ctx.raw);
            const isInvestment = ctx.dataset.label === "투자금";
            const formattedValue = `₩${raw.toLocaleString("ko-KR")}`;

            return `${ctx.dataset.label}: ${formattedValue}`;
          },
        },
      },
    },
    interaction: { mode: "nearest" as const, intersect: false },
    scales: {
      y: {
        grace: "15%",
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
          drawBorder: false,
        },
        title: {
          display: true,
          text: "금액 (원)",
          color: "#94a3b8",
          font: { weight: "bold" as const, size: 14 },
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (tick: string | number) => {
            const value = Number(tick);
            if (value >= 1000000) {
              return `₩${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `₩${(value / 1000).toFixed(0)}K`;
            }
            return `₩${value.toLocaleString("ko-KR")}`;
          },
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "날짜",
          color: "#94a3b8",
          font: { weight: "bold" as const, size: 14 },
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="h-96">
      <Line options={options} data={chartData} />
    </div>
  );
}
