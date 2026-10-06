import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "MatterZero app icon";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#16463b",
        color: "#f8f7f2",
        fontFamily: "Arial",
        fontSize: 124,
        fontWeight: 700,
        letterSpacing: -12,
      }}
    >
      M
      <div
        style={{
          position: "absolute",
          right: 25,
          bottom: 25,
          display: "flex",
          width: 42,
          height: 42,
          alignItems: "center",
          justifyContent: "center",
          border: "5px solid #16463b",
          borderRadius: 24,
          background: "#c9ed78",
          color: "#10382f",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 10,
            height: 16,
            marginTop: -4,
            borderRight: "5px solid #10382f",
            borderBottom: "5px solid #10382f",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    </div>,
    size,
  );
}
