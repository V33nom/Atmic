import React, { useState, useEffect, useRef } from "react";
import "./Narration.css";

const splitVerseLines = (verse) =>
  verse.split("।").filter(Boolean).map(line => line + "।");

const NarrationPage = ({ grantRandomCard }) => {
  const [hymns, setHymns] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [highlightedLineIndex, setHighlightedLineIndex] = useState(-1);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1);

  const speechQueueRef = useRef([]);
  const pausedRef = useRef(false);
  const currentUtteranceRef = useRef(null);

  // Reward logic (probability + pity)
  const completedNarrationsRef = useRef(0);     // counts finished mantras since last drop
  const BASE_DROP_RATE = 0.22;                  // 22% chance per completed mantra
  const PITY_THRESHOLD = 6;                     // guarantee a drop after 6 if none yet

  useEffect(() => {
    const loadHymns = async () => {
      try {
        const res = await fetch("https://rigveda-api.onrender.com/api/hymns");
        const data = await res.json();
        setHymns(data);
      } catch (err) {
        console.error("Failed to fetch hymns:", err);
      }
    };
    loadHymns();
  }, []);

  const currentHymn = hymns[selectedIndex];
  const verseLines = currentHymn ? splitVerseLines(currentHymn.sanskrit) : [];

  const generateLifeLesson = (hymn) => {
    const themes = hymn.themes.join(", ");
    return `This verse teaches values related to ${themes}, guiding personal growth and everyday life.`;
  };

  const speakText = (text, lang = "hi-IN") =>
    new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        alert("Your browser does not support speech synthesis.");
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;
      utterance.onend = resolve;
      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });

  const tryAwardOnCompletion = () => {
    // Increment pity counter
    completedNarrationsRef.current += 1;

    // Pity guarantee
    if (completedNarrationsRef.current >= PITY_THRESHOLD) {
      grantRandomCard?.();
      completedNarrationsRef.current = 0;
      return;
    }

    // Probabilistic drop
    if (Math.random() < BASE_DROP_RATE) {
      grantRandomCard?.();
      completedNarrationsRef.current = 0; // reset pity after a drop
    }
  };

  const startNarration = async () => {
    if (!currentHymn) return;
    setIsPlaying(true);
    setShowContent(false);
    setHighlightedLineIndex(-1);
    window.speechSynthesis.cancel();
    pausedRef.current = false;

    speechQueueRef.current = [
      ...verseLines.map((line, i) => ({ text: line, lang: "hi-IN", lineIndex: i })),
      { text: currentHymn.translation, lang: "en-US", lineIndex: -1 },
      { text: generateLifeLesson(currentHymn), lang: "en-US", lineIndex: -1 }
    ];

    while (speechQueueRef.current.length > 0) {
      if (pausedRef.current) {
        await new Promise(res => setTimeout(res, 200));
        continue;
      }

      const { text, lang, lineIndex } = speechQueueRef.current.shift();
      setHighlightedLineIndex(lineIndex);
      await speakText(text, lang);
    }

    // narration finished
    setIsPlaying(false);
    setShowContent(true);
    setHighlightedLineIndex(-1);

    // Attempt reward via probability/pity
    tryAwardOnCompletion();
  };

  const handlePauseResume = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      window.speechSynthesis.resume();
    } else {
      pausedRef.current = true;
      window.speechSynthesis.pause();
    }
  };

  const handleSkip = () => {
    if (speechQueueRef.current.length > 0) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    startNarration();
  };

  const handleHymnChange = (e) => {
    setSelectedIndex(Number(e.target.value));
    setIsPlaying(false);
    setShowContent(false);
    setHighlightedLineIndex(-1);
    window.speechSynthesis.cancel();
  };

  if (!hymns.length) return <div>Loading...</div>;

  return (
    <div className="narration-page rv-main">
      <header className="header">
        <h1>🕉️ Mantra Sage</h1>
        <p>Hear ancient verses narrated, explained, and interpreted with AI-driven wisdom.</p>
      </header>

      <div className="selector">
        <select value={selectedIndex} onChange={handleHymnChange}>
          {hymns.map((hymn, idx) => (
            <option key={idx} value={idx}>
              Mandala {hymn.mandala}, Hymn {hymn.hymn} (Deity: {hymn.deities.join(", ")})
            </option>
          ))}
        </select>
      </div>

      <div className="controls">
        <label>
          Rate:
          <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label>
          Pitch:
          <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
        </label>
      </div>

      <div className="audio-btn-container">
        <button onClick={startNarration} disabled={isPlaying} className="audio-btn">
          {isPlaying ? "Playing..." : "Narrate & Explain"}
        </button>
        {isPlaying && (
          <>
            <button onClick={handlePauseResume} className="audio-btn pause-btn">
              {pausedRef.current ? "Resume" : "Pause"}
            </button>
            <button onClick={handleSkip} className="audio-btn skip-btn">Skip Line</button>
            <button onClick={handleRestart} className="audio-btn restart-btn">Restart Hymn</button>
          </>
        )}
      </div>

      <div className="hymn-card">
        <div className="metadata">
          Mandala {currentHymn.mandala}, Hymn {currentHymn.hymn} (Deity: {currentHymn.deities.join(", ")})
        </div>

        <div className="sanskrit">
          {verseLines.map((line, idx) => (
            <p key={idx} className={highlightedLineIndex === idx ? "highlighted-line" : ""}>
              {line}
            </p>
          ))}
        </div>

        <div className="translation">{currentHymn.translation}</div>

        {showContent && (
          <div className="life-lesson">
            <h2>Life Lesson</h2>
            <p>{generateLifeLesson(currentHymn)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NarrationPage;
