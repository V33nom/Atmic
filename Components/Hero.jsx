import React from 'react';
import heroImg from "../assets/hero.png";

export default function Hero() {
  return (
    <section style={{ padding: '40px 0 0 0', background: '#e2d2a0ff' }}>
      <div
        style={{
          width: '90vw',
          margin: '0 auto',
          borderRadius: '24px',
          background: `#5b4128 url(${heroImg}) center 22% / cover no-repeat`,
          boxShadow: '0 4px 34px 0 rgba(32,28,60,.07)',
          padding: '40px 0 0 0',
          minHeight: '480px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* No need for separate image tag, background handles it */}
        <span style={{
          display: 'block',
          color: '#222',
          fontSize: '1rem',
          margin: '6px 0 4px 8px',
          opacity: 0.85
        }}>
        </span>
        {/* Main Text */}
        <div style={{
          margin: '50px 0 44px 0',
          paddingLeft: 32,
          zIndex: 2,
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            letterSpacing: '-.05em',
            marginBottom: '0.5rem',
            lineHeight: '1.1',
            color: '#fff',
            textShadow: '0 1px 14px #a7a7a7'
          }}>
            UNLOCK<br />ANCIENT<br />WISDOM.
          </h1>
          <div style={{ fontSize: "1.15rem", color: "#222", marginBottom: 36 }}>
            An AI-powered journey into the heart of the Rig Veda. Explore, question,<br />
            and listen to the world’s oldest scriptures like never before.
          </div>
        </div>
        {/* Verses Indexed Card */}
        <div style={{
          position: 'absolute',
          right: 40,
          bottom: 36,
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 1px 16px rgba(0,0,0,.07)',
          padding: '20px 34px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          minWidth: '160px',
          zIndex: 3
        }}>
          <span style={{
            background: '#fff3dd',
            borderRadius: '8px',
            padding: '9px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '18px'
          }}>
            <svg width="30" height="30" fill="#ffba46"><rect width="100%" height="100%" rx="7"></rect></svg>
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#45355f' }}>19+</div>
            <div style={{ fontSize: '1.0rem', color: '#826eac' }}>Verses Indexed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
