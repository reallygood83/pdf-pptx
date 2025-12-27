import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NotePPT - AI 기반 PDF to PPTX 변환기";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {/* Logo/Icon Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* PDF Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "100px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                borderRadius: "12px",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
              }}
            >
              PDF
            </div>

            {/* Arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#60a5fa",
                fontSize: "48px",
              }}
            >
              →
            </div>

            {/* PPTX Icon with AI Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "100px",
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)",
                }}
              >
                PPTX
              </div>
              {/* AI Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 12px",
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  borderRadius: "20px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                }}
              >
                + AI Notes
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
              letterSpacing: "-2px",
            }}
          >
            NotePPT
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            PDF를 AI 발표자 노트가 포함된 PPTX로 변환
          </div>

          {/* AI Providers */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            {["Gemini", "GPT-4o", "Claude", "Grok"].map((ai) => (
              <div
                key={ai}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 20px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "30px",
                  color: "#e2e8f0",
                  fontSize: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {ai}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontSize: "20px",
          }}
        >
          <span>noteppt.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
