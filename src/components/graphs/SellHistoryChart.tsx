import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Chart from "chart.js/auto";

export type Props = {
  data: {
    labels: string[];
    avgSellData: number[];
    totalSellData: number[];
  };
  loading?: boolean;
};

export const SellHistoryChart = ({ data, loading }: Props) => {
  const theme = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || loading) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Avg: Sell Price",
            data: data.avgSellData,
            backgroundColor: data.labels.map((_, index) => 
              index === 3 ? "#0A82FD" : "#E8EDFF"
            ),
            hoverBackgroundColor: "#0A82FD",
            borderWidth: 0,
            borderRadius: {
              topLeft: 8,
              topRight: 8,
              bottomLeft: 0,
              bottomRight: 0,
            },
            barPercentage: 0.8,
            categoryPercentage: 0.5,
          },
          {
            label: "Total Sell",
            data: data.totalSellData,
            backgroundColor: data.labels.map((_, index) => 
              index === 3 ? "#F2C94C" : "#E8EDFF"
            ),
            hoverBackgroundColor: "#F2C94C",
            borderWidth: 0,
            borderRadius: {
              topLeft: 8,
              topRight: 8,
              bottomLeft: 0,
              bottomRight: 0,
            },
            barPercentage: 0.8,
            categoryPercentage: 0.5,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: "#5D6A83",
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: "#5D6A83",
              callback: function (value) {
                return value + "%";
              },
            },
            grid: {
              drawBorder: false,
              color: "#D7DCE7",
              borderDash: [5, 5],
            },
          },
        },
        plugins: {
          tooltip: {
            padding: 10,
            displayColors: true,
            yAlign: "bottom",
            backgroundColor: "#fff",
            titleColor: "#000",
            titleFont: { weight: "normal" },
            bodyColor: "#2F3032",
            cornerRadius: 12,
            borderWidth: 1,
            borderColor: "#E0E0E0",
            usePointStyle: true,
            boxPadding: 3,
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          },
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, theme]);

  if (loading) {
    return <div className="crancy-chart__loading">Loading...</div>;
  }

  return <canvas ref={chartRef} className="crancy-chart__canvas" />;
};