"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#1a1a2e",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      }).catch(() => {});
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-lg"
    />
  );
}
