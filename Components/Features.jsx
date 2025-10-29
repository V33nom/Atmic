import React from 'react';


export default function Features() {
  return (
    <section className="rv-features">
      <div className="rv-features-left">
        <h2>Keep Up With Our Features</h2>
        <p>
          Explore the ever-expanding universe of Vedic knowledge with our suite of AI-powered tools.
        </p>
      </div>
      <div className="rv-features-list">
        <div className="rv-feature-card">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">01</div>
            <div className="rv-feature-title">Ask the Vedas</div>
            <div className="rv-feature-desc">
              Engage in a dialogue with ancient wisdom. Ask questions and receive AI-powered insights from the Rig Veda.
            </div>
          </div>
          <div className="rv-feature-arrow">&#8594;</div>
        </div>
        <div className="rv-feature-card highlighted">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">02</div>
            <div className="rv-feature-title">Mantra Sage</div>
            <div className="rv-feature-desc">
              Hear hymns narrated, explained, and interpreted with life lessons by our AI sage.
            </div>
          </div>
          <div className="rv-feature-arrow">&#8594;</div>
        </div>
        <div className="rv-feature-card">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">03</div>
            <div className="rv-feature-title">explore the deity </div>
            <div className="rv-feature-desc">
             explore the divine entities of the Rig Veda through our interactive collection of deity cards. and graphs
            </div>
          </div>
          <div className="rv-feature-arrow">&#8594;</div>
        </div>
        <div className="rv-feature-card highlighted">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">04</div>
            <div className="rv-feature-title">quiz</div>
            <div className="rv-feature-desc">
              quiz, unscamble know rigveda while playing game and win rewards.
            </div>
          </div>
          <div className="rv-feature-arrow">&#8594;</div>
        </div>
      </div>
    </section>
  );
}
