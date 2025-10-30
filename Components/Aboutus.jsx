import React, { useState, useEffect } from 'react';
import about from "../assets/abou.png";

const aboutData = [
  {
    img: about,
    title: "Sage",
    sub: "AI Scholar",
    desc: "A close up of a thoughtful person, suggesting wisdom and insight."
  }
];

const SLIDE_INTERVAL = 3000;

export default function AboutusSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % aboutData.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Card dimensions are responsive
  const CARD_MAX_WIDTH = 470;  // desktop
  const CARD_MAX_HEIGHT = 325;

  const card = aboutData[current];

  return (
    <section className="aboutus-slider-section"
      style={{
        minHeight: "60vh",
        width: "80vw",
        background: "linear-gradient(120deg,#f9efcb,#e1d1a5 90%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Giant background title */}
      <div
        className="aboutus-title"
        style={{
          fontFamily: "serif",
          fontWeight: 900,
          fontSize: "56px",
          color: "#f0e0bd",
          position: "absolute",
          top: "98px",
          left: "50%",
          transform: "translateX(-50%)",
          letterSpacing: ".06em",
          opacity: 0.47,
          zIndex: 1,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          textShadow: "0 3px 32px #d2c189"
        }}
      >
        QUALITY-WISDOM
      </div>
      {/* Position the actual card/overlay in front */}
      <div className="aboutus-slider-wrapper"
        style={{
          margin: "165px 0 0 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          zIndex: 2,
        }}>
        <div
          className="aboutus-card"
          style={{
            width: "80vw",
            maxWidth: CARD_MAX_WIDTH,
            height: `min(62vw,${CARD_MAX_HEIGHT}px)`,
            minHeight: "220px",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 16px 48px #b6ae8050, 0 2px 8px #bfa96433",
            background: `url(${card.img}) center top / cover no-repeat`,
            transform: "rotate(-30deg)",
            transition: "box-shadow .22s",
            margin: "0 auto",
            display: "flex",
            alignItems: "stretch"
          }}>
          {/* Overlay all text on image, fully responsive */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            background:
              "linear-gradient(180deg, rgba(54,39,18,0.09) 6%,rgba(12,8,3,0.21) 74%,rgba(5,5,5,0.59) 104%)",
            padding: "0 0 30px 30px",
          }}>
            <div className="aboutus-card-title" style={{
              fontWeight: 800,
              fontSize: "2rem",
              textShadow: "0 1px 24px #201b1099,0 1px 3px #372a24",
              letterSpacing: ".03em",
              marginBottom: "4px"
            }}>{card.title}</div>
            <div className="aboutus-card-sub" style={{
              color: "#f7ffb9",
              fontSize: "1.19rem",
              fontWeight: 600,
              marginBottom: 10,
              textShadow: "0 1px 8px #211d0f70"
            }}>{card.sub}</div>
            <div className="aboutus-card-desc" style={{
              color: "#ffeccc",
              fontSize: "1.07rem",
              fontWeight: 500,
              maxWidth: "92%",
              lineHeight: 1.33,
              textShadow: "0 2px 6px #372b1690"
            }}>{card.desc}</div>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="aboutus-dots"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "32px auto 0 auto",
          zIndex: 2
        }}
      >
        {aboutData.map((_, idx) => (
          <span
            key={idx}
            className={`aboutus-dot${idx === current ? " active" : ""}`}
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              background: idx === current ? "#dfb75c" : "#eee7d1",
              borderRadius: "50%",
              margin: "0 7px",
              cursor: "pointer",
              border: idx === current ? "2px solid #bfa657" : "2px solid #eadfbf",
              transition: "all .3s"
            }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
      <style>
        {`
          @media (max-width: 700px) {
            .aboutus-title {
              font-size: 30px !important;
            }
            .aboutus-card-title { font-size: 1.33rem !important; }
          }
          @media (max-width: 520px) {
            .aboutus-slider-wrapper { margin-top: 80px !important; }
            .aboutus-title { top: 45px !important; font-size: 1.5rem !important; }
          }
          @media (max-width: 415px) {
            .aboutus-slider-wrapper { margin-top: 16vw !important; }
            .aboutus-card-title { font-size: 1.09rem !important; }
            .aboutus-card-desc { font-size: .99rem !important; }
          }
        `}
      </style>
    </section>
  );
}

