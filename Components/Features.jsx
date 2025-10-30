import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Features() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <section className="rv-features">
      <div className="rv-features-left">
        <h2>Keep Up With Our Features</h2>
        <p>
          Explore the ever-expanding universe of Vedic knowledge with our suite of AI-powered tools.
        </p>
      </div>

      <div className="rv-features-list">
        {/* === Feature 01 === */}
        <div className="rv-feature-card">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">01</div>
            <div className="rv-feature-title">Ask the Vedas</div>
            <div className="rv-feature-desc">
              Engage in a dialogue with ancient wisdom. Ask questions and receive AI-powered insights from the Rig Veda.
            </div>
          </div>
          <div
            className="rv-feature-arrow"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('/chatbot')}
          >
            &#8594;
          </div>
        </div>

        {/* === Feature 02 === */}
        <div className="rv-feature-card highlighted">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">02</div>
            <div className="rv-feature-title">Mantra Sage</div>
            <div className="rv-feature-desc">
              Hear hymns narrated, explained, and interpreted with life lessons by our AI sage.
            </div>
          </div>
          <div
            className="rv-feature-arrow"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('/narration')}
          >
            &#8594;
          </div>
        </div>

        {/* === Feature 03 === */}
        <div className="rv-feature-card">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">03</div>
            <div className="rv-feature-title">Explore the Deity</div>
            <div className="rv-feature-desc">
              Explore the divine entities of the Rig Veda through our interactive collection of deity cards and graphs.
            </div>
          </div>
          <div
            className="rv-feature-arrow"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('/explore')}
          >
            &#8594;
          </div>
        </div>

        {/* === Feature 04 === */}
        <div className="rv-feature-card highlighted">
          <div className="rv-feature-icon"></div>
          <div>
            <div className="rv-feature-num">04</div>
            <div className="rv-feature-title">Quiz</div>
            <div className="rv-feature-desc">
              Quiz, unscramble, and learn Rig Veda while playing and winning rewards.
            </div>
          </div>
          <div
            className="rv-feature-arrow"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('/quiz')}
          >
            &#8594;
          </div>
        </div>
      </div>
    </section>
  );
}
