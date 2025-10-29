import React, { useState } from 'react';
import { deityCards } from './deityCards';

// List of motivational quotes
const quotes = [
  "Keep moving forward!",
  "Today is your fresh start.",
  "Progress, not perfection.",
  "Your journey matters.",
  "Believe in your inner light.",
  "Small steps create big change.",
  "Growth is happening every day.",
  "Wisdom is the reward for curiosity."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default function CardCollection({ unlocked }) {
  const [flippedCard, setFlippedCard] = useState(null);

  return (
    <div style={{
      background: "#faf8ef",
      minHeight: "80vh",
      padding: "40px 6vw",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{
        textAlign: "center",
        fontSize: "2.2rem",
        color: "#7c4d13",
        fontWeight: 700,
        marginBottom: 10
      }}>
        Deity Collection
      </h1>
      <p style={{
        textAlign: "center",
        color: "#6a6a6a",
        fontSize: "1.09em",
        marginBottom: 24
      }}>
        Discover and collect the divine entities of the Rig Veda.
      </p>
      <div style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.15em",
        marginBottom: 34
      }}>
        {unlocked.length} / {deityCards.length} <span style={{ color: "#338a57" }}>discovered</span>
      </div>
      <div className="collection-grid">
        {deityCards.map(card => {
          const isUnlocked = unlocked.includes(card.id);
          const isFlipped = flippedCard === card.id;
          return (
            <div
              key={card.id}
              className="collection-card"
              style={{
                perspective: "900px",
                width: "100%",
                maxWidth: "290px",
                minHeight: "260px"
              }}
              onClick={() => isUnlocked ? setFlippedCard(flippedCard === card.id ? null : card.id) : undefined}
              tabIndex={isUnlocked ? 0 : -1}
            >
              <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 300,
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                borderRadius: "20px",
                boxShadow: isUnlocked
                  ? "0 4px 18px rgba(253,186,116,0.07)"
                  : "0 2px 16px rgba(120,116,130,0.06)",
                transform: isFlipped ? "rotateY(180deg)" : "none",
                cursor: isUnlocked ? "pointer" : "default",
                overflow: "hidden"
              }}>
                {/* Front of card */}
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: isUnlocked ? "#fff8ed" : "#f5f7fa",
                  border: isUnlocked
                    ? "2.5px solid #fdba74"
                    : "2px solid #e3e3e3",
                  borderRadius: "20px",
                  textAlign: "center",
                  overflow: "hidden"
                }}>
                  {isUnlocked ? (
                    <>
                      {/* Card image fills whole card */}
                      <img
                        src={card.image}
                        alt={card.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 1
                        }}
                      />
                      {/* Overlay for gradients and text */}
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "26px 14px 24px 14px",
                        background: "linear-gradient(180deg,rgba(35,23,1,0.09) 0%,rgba(30,20,12,0.14) 35%,rgba(28,19,8,0.39) 76%,rgba(25,16,20,0.76) 100%)"
                      }}>
                        <h3 style={{
                          color: "#ffd491",
                          fontSize: "1.18em",
                          fontWeight: 700,
                          margin: "0 0 7px",
                          letterSpacing: ".01em",
                          textShadow: "0 1px 6px #25231b94"
                        }}>{card.name}</h3>
                        <div style={{
                          color: "#e9e0cb",
                          fontSize: ".97em",
                          marginBottom: 5,
                          lineHeight: "1.3em",
                          textShadow: "0 1px 5px #1118"
                        }}>
                          {card.fact}
                        </div>
                        <div style={{
                          color: "#b6fdba",
                          fontWeight: "bold",
                          fontSize: "1.05em",
                          textShadow: "0 2px 4px #283b2955"
                        }}>
                          {card.wisdom}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%"
                    }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        marginBottom: "16px",
                        marginTop: "38px",
                        background: "#ece4d3",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <svg width="28" height="28" fill="#bdb9a2" viewBox="0 0 24 24">
                          <path d="M12 12a2 2 0 0 0-2 2v2h4v-2a2 2 0 0 0-2-2zm5 2v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-2a5 5 0 1 1 10 0z" />
                        </svg>
                      </div>
                      <h4 style={{
                        fontWeight: 600,
                        color: "#7d818c",
                        fontSize: "1.07em",
                        marginBottom: "7px"
                      }}>
                        Undiscovered
                      </h4>
                      <div style={{
                        color: "#b3b3b3",
                        fontSize: "1em",
                        marginBottom: "8px"
                      }}>
                        Complete challenges to unlock this deity.
                      </div>
                    </div>
                  )}
                </div>
                {/* Back of card */}
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: "#ffeccf",
                  border: "2px solid #fdba74",
                  borderRadius: "20px",
                  transform: "rotateY(180deg)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <div style={{
                    color: "#315432",
                    fontSize: "1.12em",
                    maxWidth: 200,
                    fontWeight: 600,
                    textAlign: "center"
                  }}>
                    {getRandomQuote()}
                  </div>
                  <div style={{
                    marginTop: "24px",
                    fontSize: "0.97em",
                    color: "#b9935d",
                    letterSpacing: "0.04em"
                  }}>
                    Tap to flip back
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>
        {`
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
          justify-items: center;
        }
        @media (max-width: 1200px) {
          .collection-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
          }
        }
        @media (max-width: 900px) {
          .collection-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }
        @media (max-width: 600px) {
          .collection-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 0 4vw;
          }
          .collection-card {
            min-height: 180px !important;
            max-width: 98vw !important;
          }
        }
        `}
      </style>
    </div>
  );
}
