import { useState, useEffect } from "react";
import GraphView from "../Components/Graphview";
import VersePopup from "../Components/Sidepanel";

// Adjust these based on your actual header/footer heights in px
const HEADER_HEIGHT = 0;
const FOOTER_HEIGHT = 0;

export default function Explorer({ grantRandomCard }) {
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [verses, setVerses] = useState([]);

  // Prevent scrolling when sidepanel is open
  useEffect(() => {
    document.body.style.overflow = selectedDeity ? "hidden" : "auto";
  }, [selectedDeity]);

  // Debug: confirm if data from GraphView is reaching Explorer
  useEffect(() => {
    if (selectedDeity) {
      console.log("✅ Selected Deity:", selectedDeity);
      console.log("📜 Hymns received:", verses);
    }
  }, [selectedDeity, verses]);

  // Keep your existing inline handler but also forward the award prop
  const handleNode = (deity, hymns) => {
    console.log("🎯 Node clicked:", deity, hymns?.length, "hymns");
    setSelectedDeity(deity);
    setVerses(hymns || []);
  };

  return (
    <div
      className="rv-container"
      style={{
        // Parchment background with soft vignette (matches other pages)
        background: `
          radial-gradient(1200px 800px at 50% -10%, rgba(94,58,13,0.06), transparent 55%),
          radial-gradient(900px 700px at -10% 110%, rgba(94,58,13,0.05), transparent 65%),
          radial-gradient(900px 700px at 110% 110%, rgba(94,58,13,0.05), transparent 65%),
          linear-gradient(135deg, #f6e7c4 0%, #edd19c 100%)
        `,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Optional corner overlays (if you have SVGs in /public/ui) */}
      <div
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          backgroundImage: `
            url('/ui/mandala-top-right.svg'),
            url('/ui/mandala-bottom-left.svg')
          `,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "right -120px top -80px, left -120px bottom -80px",
          backgroundSize: "540px auto, 540px auto",
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />

      {/* Main graph area fills between header & footer */}
      <div
        style={{
          position: "absolute",
          top: HEADER_HEIGHT, // start below the header
          left: 0,
          right: 0,
          bottom: FOOTER_HEIGHT, // end above the footer
          width: "100vw",
          height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
          // Use darker parchment for the graph stage so links/nodes pop
          background: "linear-gradient(180deg, #f7e6c6 0%, #f0d8ae 100%)",
          borderTop: "1.6px solid #caa468",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 -12px 28px rgba(82,54,19,0.12)",
          overflow: "hidden",
        }}
      >
        <GraphView onNodeClick={handleNode} grantRandomCard={grantRandomCard} />

        {selectedDeity && (
          <VersePopup
            deity={selectedDeity}
            hymns={verses}
            onClose={() => {
              console.log("❌ Closing sidepanel");
              setSelectedDeity(null);
            }}
          />
        )}
      </div>

      {/* Subtle top banner strip to visually align with other pages (no layout change) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 12 + HEADER_HEIGHT,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(880px, 92vw)",
          height: 10,
          borderRadius: 999,
          background:
            "linear-gradient(180deg, rgba(74,46,29,0.85) 0%, rgba(123,74,42,0.85) 85%)",
          border: "1px solid #b08645",
          boxShadow:
            "0 8px 18px rgba(82,54,19,0.22), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      />
    </div>
  );
}
