"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  Pemasukan: {
    label: "Pemasukan",
    color: "#22c55e", // Hijau
  },
  Pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444", // Merah
  },
} satisfies ChartConfig;

export interface RatioDataItem {
  jenis: string; // "pemasukan" | "pengeluaran"
  persentase: number;
  nominalAsli: number; // Total nominal
  fill: string; // Warna hex / CSS variable
}

interface PieIncomeVsExpenseProps {
  data: RatioDataItem[];
}

export function PieIncomeVsExpense({
  data = [],
}: PieIncomeVsExpenseProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 italic">
        Belum ada data keuangan
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-[250px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{name}:</span>
                    <span className="font-bold">{value}%</span>
                  </div>
                )}
              />
            }
          />
          <Pie data={data} dataKey="persentase" nameKey="jenis">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="jenis" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
