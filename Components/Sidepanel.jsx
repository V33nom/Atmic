import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Sidepanel({ deity, hymns = [], onClose }) {
  // Escape key closes panel
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!deity) return null;

  // Portal to <body> so it overlays everything
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto"
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          minWidth: 320,
          maxWidth: 500,
          width: "92%",
          borderRadius: 18,
          boxShadow: "0 2px 32px 6px rgba(0,0,0,0.14)",
          padding: "32px 32px 28px 32px",
          position: "relative",
          fontFamily: "Inter, Roboto, Arial, sans-serif"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            background: "#f59e0b",
            color: "#232323",
            fontWeight: 900,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 1px 6px 1px #deb94133"
          }}
          aria-label="Close"
        >✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#533ff5",
            marginBottom: 4
          }}>
            {deity}
          </div>
          <div style={{ color: "#6b7280", fontSize: 15, marginBottom: 8 }}>
            Deity • RigVeda Explorer
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxHeight: "48vh", overflowY: "auto" }}>
          {hymns.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", fontSize: 16 }}>
              No hymns found for this deity.
            </div>
          ) : (
            hymns.map((h, idx) => (
              <div
                key={`${h.mandala}-${h.hymn}-${h.verse}-${idx}`}
                style={{
                  marginBottom: 18,
                  background: "#f9f6eb",
                  border: "1px solid #f3ddaa",
                  borderRadius: 8,
                  padding: 18,
                  boxShadow: "0 1px 8px 1px #eedfa040"
                }}
              >
                <div style={{
                  color: "#bd8627",
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 2
                }}>
                  Mandala {h.mandala}, Hymn {h.hymn}, Verse {h.verse}
                </div>
                {h.title && (
                  <div style={{
                    color: "#c6944a",
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 3
                  }}>
                    {h.title}
                  </div>
                )}
                {h.sanskrit && (
                  <div style={{
                    fontFamily: "serif",
                    fontSize: 18,
                    color: "#2b2d38",
                    marginBottom: 3
                  }}>
                    {h.sanskrit}
                  </div>
                )}
                {h.translation && (
                  <div style={{
                    fontSize: 15,
                    color: "#23390d",
                    fontStyle: "italic"
                  }}>
                    {h.translation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
