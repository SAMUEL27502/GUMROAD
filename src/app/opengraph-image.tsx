import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TradeBib — Automated MT5 Bots Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #020617 0%, #0c4a6e 55%, #082f49 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #38bdf8, #0284c7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            TB
          </div>
          TradeBib
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Automated MT5 Bots Marketplace
          </div>
          <div style={{ fontSize: 28, color: "#bae6fd", maxWidth: 820 }}>
            Browse, subscribe, and deploy verified Expert Advisors with real performance data.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#7dd3fc" }}>tradebib.com</div>
      </div>
    ),
    { ...size }
  );
}
