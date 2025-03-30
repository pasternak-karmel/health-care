"use client";

import { useEffect, useRef } from "react";

export function StageDistribution() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Sample data for stage distribution
    const stageData = {
      labels: ["Stade 1", "Stade 2", "Stade 3", "Stade 4", "Stade 5"],
      values: [12, 28, 45, 18, 7],
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1"],
    };

    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const total = stageData.values.reduce((sum, value) => sum + value, 0);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw donut chart
    const radius = (Math.min(width, height) / 2) * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;
    const donutWidth = radius * 0.4;

    let startAngle = -0.5 * Math.PI; // Start at top

    // Draw each segment
    stageData.values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(
        centerX,
        centerY,
        radius - donutWidth,
        endAngle,
        startAngle,
        true
      );
      ctx.closePath();

      ctx.fillStyle = stageData.colors[index];
      ctx.fill();

      // Calculate position for percentage label
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius - donutWidth / 2;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      // Draw percentage if segment is large enough
      if (sliceAngle > 0.2) {
        const percentage = Math.round((value / total) * 100);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }

      startAngle = endAngle;
    });

    // Draw center circle (hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - donutWidth, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Draw total in center
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${total}`, centerX, centerY - 10);
    ctx.font = "12px sans-serif";
    ctx.fillText("patients", centerX, centerY + 10);

    // Draw legend
    const legendX = 10;
    let legendY = height - 100;
    const legendSquareSize = 12;
    const legendSpacing = 20;

    stageData.labels.forEach((label, index) => {
      // Draw colored square
      ctx.fillStyle = stageData.colors[index];
      ctx.fillRect(legendX, legendY, legendSquareSize, legendSquareSize);

      // Draw label
      ctx.fillStyle = "#000000";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `${label} (${stageData.values[index]})`,
        legendX + legendSquareSize + 5,
        legendY + legendSquareSize / 2
      );

      legendY += legendSpacing;
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={chartRef}
        width={300}
        height={300}
        className="max-w-full"
        style={{ maxHeight: "250px" }}
      />
    </div>
  );
}
