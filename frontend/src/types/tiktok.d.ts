interface TikTokPixel {
  track: (event: string, params?: Record<string, unknown>) => void;
  identify: (params: Record<string, unknown>) => void;
  page: () => void;
  load: (id: string) => void;
}

declare global {
  interface Window {
    ttq?: TikTokPixel;
  }
}

export {};
