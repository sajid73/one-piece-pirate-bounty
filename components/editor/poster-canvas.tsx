"use client";

import { useRef, useEffect, useState } from "react";
import { usePosterStore } from "@/lib/use-poster-store";
import { renderPoster } from "@/lib/render-poster";

export default function PosterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = usePosterStore();
  const [loaded, setLoaded] = useState<{
    url: string;
    img: HTMLImageElement;
  } | null>(null);

  useEffect(() => {
    const url = config.photo.dataUrl;
    if (!url) return;
    const img = new Image();
    img.onload = () => setLoaded({ url, img });
    img.src = url;
  }, [config.photo.dataUrl]);

  const photoImage =
    loaded && loaded.url === config.photo.dataUrl ? loaded.img : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    document.fonts.ready.then(() => {
      renderPoster(ctx, config, photoImage);
    });
  }, [config, photoImage]);

  return (
    <canvas
      ref={canvasRef}
      className="shadow-2xl shadow-black/50 rounded"
      style={{
        maxWidth: "100%",
        maxHeight: "calc(100vh - 80px)",
      }}
    />
  );
}
