import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PromptForge – Build SaaS Apps with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0b14 0%, #0f1123 50%, #0a0b14 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            marginBottom: "28px",
            boxShadow: "0 0 60px rgba(99,102,241,0.5)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "white",
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          PromptForge
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(148,163,184,1)",
            fontWeight: "400",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: "1.4",
          }}
        >
          Turn any SaaS idea into production-ready code in minutes
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["NestJS Backend", "Prisma + PostgreSQL", "REST API", "Docker"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.35)",
                color: "rgba(165,180,252,1)",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            color: "rgba(71,85,105,1)",
            fontSize: "18px",
          }}
        >
          promptforgeai.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
