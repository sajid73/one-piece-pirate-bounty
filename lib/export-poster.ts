import { PosterConfig, POSTER_WIDTH, POSTER_HEIGHT } from "./poster-config";
import { renderPoster } from "./render-poster";

export type ExportScale = 1 | 2 | 4;

export async function exportPoster(
  config: PosterConfig,
  photoImage: HTMLImageElement | null,
  scale: ExportScale = 2,
): Promise<void> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  renderPoster(ctx, config, photoImage, scale);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return resolve();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const slug = config.name.replace(/\s+/g, "-").toLowerCase() || "poster";
        a.download = `pirate-bounty-${slug}-${POSTER_WIDTH * scale}x${POSTER_HEIGHT * scale}.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
    );
  });
}
