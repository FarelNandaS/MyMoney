"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface CategoryData {
  category: string;
  amount: number; // nominal Rupiah
  fill: string;
}

interface DonutChartProps {
  data: CategoryData[];
  totalAmount: number;
}

export function DonutChart({ data, totalAmount }: DonutChartProps) {
  // Cari kategori dengan nominal/persentase terbanyak
  const maxCategoryItem = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce(
      (max, item) => (item.amount > max.amount ? item : max),
      data[0],
    );
  }, [data]);

  // Hitung persentase untuk kategori terbesar
  const maxPercentage = React.useMemo(() => {
    if (!totalAmount || !maxCategoryItem) return "0%";
    return `${((maxCategoryItem.amount / totalAmount) * 100).toFixed(1)}%`;
  }, [totalAmount, maxCategoryItem]);

  // Tambahkan persentase ke setiap kategori
  const dataWithPercentage = React.useMemo(() => {
    if (totalAmount === 0) return [];
    return data.map((item) => ({
      ...item,
      percentage: Number(((item.amount / totalAmount) * 100).toFixed(1)), // contoh: 35.5%
    }));
  }, [data, totalAmount]);

  // Buat chartConfig dinamis
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      percentage: { label: "Persentase" },
    };
    data.forEach((item) => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      };
    });
    return config;
  }, [data]);

  if (data.length === 0 || totalAmount === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 italic">
        Belum ada data pengeluaran
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart>
          {/* Custom Tooltip menampilkan Persentase (%) */}
          <ChartTooltip
            cursor={false}
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
          <Pie
            data={dataWithPercentage}
            dataKey="percentage" // Memakai data persentase untuk ukuran porsi chart
            nameKey="category"
            innerRadius="60%"
            outerRadius="80%"
            strokeWidth={4}
          >
            {/* Menampilkan Persentase Terbesar / Label Ringkasan di Tengah Donut */}
            <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {/* Tampilkan Nama Kategori Terbanyak */}
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 10}
                      className="fill-muted-foreground text-xs font-medium"
                    >
                      {maxCategoryItem ? maxCategoryItem.category : "Tidak Ada Data"}
                    </tspan>
                    
                    {/* Tampilkan Persentase Terbanyak */}
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 14}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {maxPercentage}
                    </tspan>
                  </text>
                )
              }
            }}
          />
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
