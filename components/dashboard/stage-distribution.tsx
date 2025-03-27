"use client";

import { useEffect, useRef } from "react";

export function StageDistribution() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = [
      { stage: "Stade 1", count: 35, color: "#10b981" },
      { stage: "Stade 2", count: 78, color: "#3b82f6" },
      { stage: "Stade 3", count: 95, color: "#f59e0b" },
      { stage: "Stade 4", count: 28 },
      { stage: "Stade 3", count: 95, color: "#f59e0b" },
      { stage: "Stade 4", count: 28, color: "#ef4444" },
      { stage: "Stade 5", count: 12, color: "#dc2626" },
    ];

    const total = data.reduce((sum, item) => sum + item.count, 0);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const innerRadius = radius * 0.6;

    let startAngle = 0;

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.count) / total;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        startAngle + sliceAngle,
        startAngle,
        true
      );
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      const midAngle = startAngle + sliceAngle / 2;
      const textX =
        centerX + (((radius + innerRadius) / 2) * Math.cos(midAngle)) / 2;
      const textY =
        centerY + (((radius + innerRadius) / 2) * Math.sin(midAngle)) / 2;

      startAngle += sliceAngle;
    });

    ctx.fillStyle = "#000";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), centerX, centerY - 10);

    ctx.fillStyle = "#6b7280";
    ctx.font = "12px sans-serif";
    ctx.fillText("patients", centerX, centerY + 10);

    const legendY = canvas.height - 20;
    let legendX = 10;

    data.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY, 12, 12);

      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`${item.stage} (${item.count})`, legendX + 16, legendY + 6);

      legendX += ctx.measureText(`${item.stage} (${item.count})`).width + 30;
    });
  }, []);

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} width={400} height={300} className="max-w-full" />
    </div>
  );
}
