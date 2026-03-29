import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shared Project – PromptForge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { token: string };
}

async function getProject(token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${apiUrl}/api/v1/projects/public/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export default async function OGImage({ params }: Props) {
  const project = await getProject(params.token);
  const name = project?.name ?? "Shared Project";
  const description = project?.description ?? "Built with PromptForge";
  const author = project?.user?.name ?? "";
  const fileCount = project?.fileCount ?? 0;
  const entityCount = project?.entityCount ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
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
            top: "-80px",
            right: "-80px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
          }}
        />

        {/* PromptForge brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span style={{ color: "rgba(148,163,184,1)", fontSize: "18px", fontWeight: "600" }}>
            PromptForge
          </span>
        </div>

        {/* Project name */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: name.length > 30 ? "52px" : "64px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-2px",
              lineHeight: "1.1",
              marginBottom: "20px",
              maxWidth: "900px",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(148,163,184,1)",
              maxWidth: "800px",
              lineHeight: "1.4",
            }}
          >
            {description}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {entityCount > 0 && (
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "rgba(165,180,252,1)",
                fontSize: "16px",
              }}
            >
              {entityCount} entities
            </div>
          )}
          {fileCount > 0 && (
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "rgba(165,180,252,1)",
                fontSize: "16px",
              }}
            >
              {fileCount} files
            </div>
          )}
          {author && (
            <div style={{ color: "rgba(71,85,105,1)", fontSize: "16px", marginLeft: "auto" }}>
              by {author}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
