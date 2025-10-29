import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

// Responsive font and node sizing logic
function getResponsiveStyle() {
  const vw = Math.max(window.innerWidth, 320);
  // Node and label are much bigger/clearer across ALL screens
  const nodeSize = Math.max(48, Math.min(155, vw * 0.16)); // bigger base + scaling
  const labelFont = Math.max(42, Math.min(88, vw * 0.07)); // clearly visible!
  return {
    nodeWidth: 500,
    nodeHeight: nodeSize * 10,
    fontSize: labelFont
  };
}

export default function GraphView({ onNodeClick, grantRandomCard }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // session counters
  const nodeClickCountRef = useRef(0);
  const hymnsViewedCountRef = useRef(0);

  // thresholds (tweakable)
  const NODE_CLICK_THRESHOLD = 5;
  const HYMNS_VIEW_THRESHOLD = 8;

  const maybeAwardForNodeClicks = () => {
    nodeClickCountRef.current += 1;
    if (nodeClickCountRef.current % NODE_CLICK_THRESHOLD === 0) {
      grantRandomCard?.();
    }
  };

  const maybeAwardForHymnsViewed = (countIncrement = 0) => {
    hymnsViewedCountRef.current += countIncrement;
    if (hymnsViewedCountRef.current >= HYMNS_VIEW_THRESHOLD) {
      hymnsViewedCountRef.current = 0;
      grantRandomCard?.();
    }
  };

  // Helper to set style responsively
  const setResponsiveCytoscapeStyle = (cy) => {
    if (!cy) return;
    const { nodeWidth, nodeHeight, fontSize } = getResponsiveStyle();
    cy.style()
      .selector("node")
      .style({
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": fontSize,
        color: "#fff",
        "text-outline-color": "#222",
        "text-outline-width": Math.floor(fontSize * 0.19), // ensures outline also scales
        "background-color": (ele) =>
          ele.data("type") === "Deity" ? "#f59e0b" : "#3b82f6",
        "border-width": 4,
        "border-color": "#fff",
        width: nodeWidth,
        height: nodeHeight,
      })
      .selector("edge")
      .style({
        width: Math.max(1, nodeWidth / 20),
        "line-color": "grey",
        "curve-style": "bezier",
      })
      .update();
  };

  useEffect(() => {
    if (cyRef.current || !containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      layout: { name: "cose", animate: true },
      userZoomingEnabled: true,
      userPanningEnabled: false,
      userSelectionEnabled: false,
      wheelSensitivity: 0.25,
      style: [],
    });

    cy.container().style.zIndex = 1;

    fetch("https://rigveda-api.onrender.com/api/hymns/deity-graph")
      .then((res) => res.json())
      .then((data) => {
        cy.add([...data.nodes, ...data.links]);
        setResponsiveCytoscapeStyle(cy);
        cy.layout({ name: "cose", animate: true }).run();
      });

    cy.on("tap", "node", async (evt) => {
      const node = evt.target.data();
      if (node.type === "Deity") {
        maybeAwardForNodeClicks();
        try {
          const res = await fetch(
            `https://rigveda-api.onrender.com/api/hymns/deity/${encodeURIComponent(node.label)}`
          );
          const json = await res.json();
          const hymnsCount = Array.isArray(json.hymns) ? json.hymns.length : 0;
          const increment = Math.min(10, Math.max(5, hymnsCount));
          maybeAwardForHymnsViewed(increment);
          onNodeClick?.(node.label, json.hymns || []);
        } catch (err) {
          console.error(err);
        }
      }
    });

    // Responsive resizer
    const handleResize = () => setResponsiveCytoscapeStyle(cy);
    window.addEventListener("resize", handleResize);

    cyRef.current = cy;
    return () => {
      window.removeEventListener("resize", handleResize);
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [onNodeClick, grantRandomCard]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
        background: "transparent",
        overflow: "hidden",
      }}
    />
  );
}
