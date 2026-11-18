import { useEffect, useState } from "react";
import { getPalette } from "colorthief";
import { rgbToHsl } from "../utils/color.ts";

const DEFAULT_COLOR = "#121212";

const MIN_PROPORTION = 0.04;
const MIN_CHROMA = 0.12;

const MIN_LIGHTNESS = 0.2;
const MAX_LIGHTNESS = 0.35;
const MIN_SATURATION = 0.4;
const MAX_SATURATION = 0.7;
const SATURATION_BOOST = 1.1;
const NEUTRAL_SATURATION = 0.1;

const BROWN_HUE_MIN = 10 / 360;
const BROWN_HUE_MAX = 50 / 360;
const BROWN_MAX_LIGHTNESS = 0.45;
const BROWN_MIN_SATURATION = 0.65;
const RED_HUE = 8 / 360;

type Palette = NonNullable<Awaited<ReturnType<typeof getPalette>>>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toHsl = (h: number, s: number, l: number) =>
  `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

const isOrangeHue = (h: number) => h >= BROWN_HUE_MIN && h <= BROWN_HUE_MAX;

const isBrown = (c: { h: number; s: number; l: number }) =>
  isOrangeHue(c.h) && (c.l < BROWN_MAX_LIGHTNESS || c.s < BROWN_MIN_SATURATION);

const pickColor = (palette: Palette, fallback: string) => {
  const total = palette.reduce((sum, c) => sum + c.proportion, 0) || 1;

  const swatches = palette.map((c) => {
    const { r, g, b } = c.rgb();
    const { h, s, l } = rgbToHsl(r, g, b);
    return {
      h,
      s,
      l,
      weight: c.proportion / total,
      chroma: s * (1 - Math.abs(2 * l - 1)),
    };
  });

  if (swatches.length === 0) return fallback;

  const avgL = swatches.reduce((sum, c) => sum + c.l * c.weight, 0);
  const lightness = MIN_LIGHTNESS + (MAX_LIGHTNESS - MIN_LIGHTNESS) * avgL;

  const best = swatches
    .filter((c) => c.weight >= MIN_PROPORTION && c.chroma >= MIN_CHROMA && !isBrown(c))
    .sort((a, b) => Math.sqrt(b.weight) * b.chroma - Math.sqrt(a.weight) * a.chroma)[0];

  if (!best) {
    const dominant = swatches.reduce((a, b) => (b.weight > a.weight ? b : a));
    return toHsl(dominant.h, NEUTRAL_SATURATION, lightness);
  }

  const saturation = clamp(best.s * SATURATION_BOOST, MIN_SATURATION, MAX_SATURATION);

  const hue = isOrangeHue(best.h) ? RED_HUE : best.h;

  return toHsl(hue, saturation, lightness);
};

const useAccentColor = (imageSrc?: string, fallback: string = DEFAULT_COLOR): string => {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    if (!imageSrc) {
      setColor(fallback);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = async () => {
      try {
        const palette = await getPalette(image, { colorCount: 10 });
        if (cancelled) return;
        setColor(palette ? pickColor(palette, fallback) : fallback);
      } catch (error) {
        console.error("Color extraction error:", error);
        if (!cancelled) setColor(fallback);
      }
    };

    image.onerror = () => {
      if (!cancelled) setColor(fallback);
    };

    image.src = imageSrc;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [imageSrc, fallback]);

  return color;
};

export default useAccentColor;
