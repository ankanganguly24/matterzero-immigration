import { ImageResponse } from "next/og";

export const alt = "MatterZero — clearer immigration case files";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px",
        background: "#10382f",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div style={{ display: "flex", width: "680px", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#c9ed78",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          matterzero
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 66,
            lineHeight: 1.02,
            letterSpacing: -3,
            fontWeight: 600,
          }}
        >
          Less chasing.
          <br />
          Clearer case files.
        </div>
        <div style={{ display: "flex", marginTop: 30, color: "#cbd9d1", fontSize: 25 }}>
          Applicant readiness for immigration teams
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: 300,
          height: 360,
          flexDirection: "column",
          justifyContent: "center",
          padding: 28,
          borderRadius: 26,
          background: "#ffffff",
          color: "#1c2925",
          boxShadow: "0 25px 80px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ display: "flex", color: "#6b7d73", fontSize: 16, fontWeight: 700 }}>
          CASE OVERVIEW
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 27, fontWeight: 700 }}>
          Applicant overview
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 23,
            padding: 18,
            borderRadius: 14,
            background: "#f4f6f1",
            fontSize: 19,
          }}
        >
          8 / 11 documents received
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            padding: 18,
            borderRadius: 14,
            background: "#fff1e5",
            color: "#9c5b36",
            fontSize: 19,
          }}
        >
          1 detail needs review
        </div>
      </div>
    </div>,
    size,
  );
}
