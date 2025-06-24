import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Chart, { ChartConfiguration } from "chart.js/auto";

export type Props = {
  data: {
    labels: string[];
    values: number[];
    colors?: string[];
  };
  loading?: boolean;
};

export const StatusDoughnutChart = ({ data, loading }: Props) => {
  const theme = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"doughnut"> | null>(null);

  useEffect(() => {
    if (!chartRef.current || loading) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Use default data if no data provided
    const chartLabels = data.labels.length > 0 ? data.labels : ["No Data"];
    const chartValues = data.values.length > 0 ? data.values : [1];
    const chartColors =
      data.values.length > 0
        ? data.colors || ["#436CFF", "#F7CA16", "#F7F8FA"]
        : ["#E8EDFF"];

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: chartColors,
            hoverOffset: 2,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading]);

  if (loading) {
    return <div className="crancy-chart__loading">Loading...</div>;
  }

  // Calculate percentages for labels
  const total = data.values.reduce((sum, val) => sum + val, 0) || 1;
  const getPercentage = (value: number) => Math.round((value / total) * 100);

  // Calculate angle positions for labels based on chart segments
  const calculateLabelPosition = (index: number) => {
    let startAngle = -90; // Start from top
    let currentAngle = startAngle;

    // Calculate the angle for each segment
    for (let i = 0; i < index; i++) {
      const segmentAngle = (data.values[i] / total) * 360;
      currentAngle += segmentAngle;
    }

    // Add half of current segment angle to position in middle of segment
    const currentSegmentAngle = (data.values[index] / total) * 360;
    currentAngle += currentSegmentAngle / 2;

    // Convert to radians
    const angleInRadians = (currentAngle * Math.PI) / 180;

    // Calculate position (adjust radius as needed)
    const radius = 70; // Distance from center - positioned to overlap with doughnut
    const centerX = 50; // Center percentage
    const centerY = 50; // Center percentage

    const x = centerX + (radius * Math.cos(angleInRadians)) / 2;
    const y = centerY + (radius * Math.sin(angleInRadians)) / 2;

    return { x, y };
  };

  return (
    <div
      className="crancy-chart__two-wrapper"
      style={{ position: "relative", height: "100%", overflow: "visible" }}
    >
      <canvas ref={chartRef} className="crancy-chart__canvas" />
      {data.labels.length > 0 && data.values.length > 0 && (
        <>
          {data.labels.map((label, index) => {
            const percentage = getPercentage(data.values[index]);
            const position = calculateLabelPosition(index);

            return (
              <div
                key={index}
                className="crancy-chart-groups__title"
                style={{
                  position: "absolute",
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              >
                <div
                  className="crancy-chart-groups__bubble"
                  style={{ minWidth: "100px", padding: "15px 25px" }}
                >
                  <span className="crancy-chart-groups__percent">
                    {percentage}%
                  </span>
                  <span className="crancy-chart-groups__label">{label}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
      {data.labels.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#5D6A83",
            fontSize: "14px",
          }}
        >
          No data available
        </div>
      )}
    </div>
  );
};
