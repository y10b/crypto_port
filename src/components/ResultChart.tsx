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
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

export interface TimelinePoint {
  date: string | Date;
  evalPrice: number;
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
    datasets: dataSets.map((set, idx) => ({
      label: set.label,
      data: set.data.map((d) => d.evalPrice),
      borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
      backgroundColor: "transparent",
      hidden: enabled ? !enabled.includes(set.label) : false,
    })),
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
  };

  return <Line options={options} data={chartData} />;
}
