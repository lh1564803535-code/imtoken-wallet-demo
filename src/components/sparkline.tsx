"use client";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "#34c759", width = 64, height = 24 }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MiniChart({ positive }: { positive: boolean }) {
  // Generate a small random-looking but deterministic chart
  const data = Array.from({ length: 12 }, (_, i) => {
    const base = positive ? 50 + i * 2 : 70 - i * 2;
    return base + Math.sin(i * 1.5) * 8;
  });

  return (
    <Sparkline
      data={data}
      color={positive ? "#34c759" : "#ff3b30"}
      width={56}
      height={20}
    />
  );
}
