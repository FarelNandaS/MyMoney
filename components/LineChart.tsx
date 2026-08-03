"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Konfigurasi Warna untuk Garis Pemasukan & Pengeluaran
const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#22c55e", // Hijau
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444", // Merah
  },
} satisfies ChartConfig;

interface ChartDataItem {
  label: string; // Sumbu X (misal: "Sen", "Minggu 1", atau "Jan")
  pemasukan: number; // Nominal total Pemasukan
  pengeluaran: number; // Nominal total Pengeluaran
}

interface LineChartTrackProps {
  data: ChartDataItem[];
  deskripsi?: string; // Opsional: Keterangan tab yang sedang aktif
}

export function LineChartTrack({ data = [], deskripsi }: LineChartTrackProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 italic">
        Belum ada catatan transaksi pada periode ini.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          horizontal={true}
          strokeDasharray="3 3"
          strokeOpacity={1}
          strokeWidth={2}
          stroke="#e4e4e7" // Zinc 200 (Mode Terang)
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />

        {/* Garis Pemasukan (Hijau) */}
        <Line
          type="monotone"
          dataKey="pemasukan"
          stroke="var(--color-pemasukan)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />

        {/* Garis Pengeluaran (Merah) */}
        <Line
          type="monotone"
          dataKey="pengeluaran"
          stroke="var(--color-pengeluaran)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
