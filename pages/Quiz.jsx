import React, { useEffect, useState, useRef } from "react";
import "./Quiz.css";
import {
  DndContext,
  useDraggable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from "@dnd-kit/core";

// Utility helpers
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const splitSanskritWords = (verse = "") =>
  verse.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);

// Life lesson generator
const generateLifeLesson = (hymn) => {
  const themes =
    hymn.themes && hymn.themes.length ? hymn.themes.join(", ") : "dharma and wisdom";
  return `This verse teaches values related to ${themes}, guiding practical living and inner growth.`;
};

// Draggable chip UI
function WordChip({ id, word, listeners, attributes, isDragging, style, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
      onClick={onClick}
      {...listeners}
      {...attributes}
      className="divine-stone cursor-grab select-none rounded-full px-5 py-2 text-lg font-semibold shadow-lg transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-amber-400/60"
      style={{
        background: "linear-gradient(180deg,#FDE68A,#F59E0B)",
        color: "#1f2937",
        ...(style || {}),
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      {word}
    </div>
  );
}

// Draggable wrapper
function DnDWord({ id, word, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  return (
    <div ref={setNodeRef} style={style}>
      <WordChip
        id={id}
        word={word}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
        onClick={onClick}
      />
    </div>
  );
}

// Droppable wrapper (added)
function DroppableArea({ id, className, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      id={id}
      className={className}
      style={{
        outline: isOver ? "2px dashed #f59e0b" : undefined,
        transition: "outline 120ms",
      }}
    >
      {children}
    </div>
  );
}

export default function ChallengeArena(props) {
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("quiz");
  const [score, setScore] = useState(0);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  const [unscrambleHymnIndex, setUnscrambleHymnIndex] = useState(0);
  const [poolWords, setPoolWords] = useState([]);
  const [builtWords, setBuiltWords] = useState([]);
  const [unscrambleFeedback, setUnscrambleFeedback] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const nameRef = useRef("");

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("https://rigveda-api.onrender.com/api/hymns");
        let data = await res.json();
        if (!cancelled) {
          if (Array.isArray(data)) data = data.slice(0, 20); // limit to 20
          setHymns(Array.isArray(data) ? data : []);
          setLoading(false);
          if (Array.isArray(data) && data.length) {
            prepareQuiz(0, data);
            prepareUnscramble(0, data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hymns:", err);
        setLoading(false);
      }
    };
    load();
    const stored = JSON.parse(localStorage.getItem("rigveda_leaderboard_v1") || "[]");
    setLeaderboard(stored);
    return () => (cancelled = true);
  }, []);

  const allDeitiesPool = () => {
    const pool = new Set();
    hymns.forEach((h) => {
      if (Array.isArray(h.deities)) h.deities.forEach((d) => pool.add(d));
    });
    ["Agni", "Indra", "Varuna", "Soma", "Vayu", "Brahma", "Vishnu", "Rudra"].forEach((d) =>
      pool.add(d)
    );
    return Array.from(pool);
  };

  function prepareQuiz(index = 0, hymnsData = hymns) {
    if (!hymnsData || hymnsData.length === 0) return;
    const hymn = hymnsData[index % hymnsData.length];
    const correct = hymn.deities && hymn.deities.length ? hymn.deities[0] : "Unknown";
    const pool = allDeitiesPool().filter((d) => d !== correct);
    const randomOptions = shuffle(pool).slice(0, 3);
    const options = shuffle([correct, ...randomOptions]);
    setQuizOptions(options);
    setQuizIndex(index % hymnsData.length);
    setQuizAnswered(false);
    setQuizCorrect(false);
  }

  function prepareUnscramble(index = 0, hymnsData = hymns) {
    if (!hymnsData || hymnsData.length === 0) return;
    const hymn = hymnsData[index % hymnsData.length];
    const words = splitSanskritWords(hymn.sanskrit || hymn.translation || "");
    const shuffled = shuffle(words);
    setPoolWords(shuffled);
    setBuiltWords([]);
    setUnscrambleHymnIndex(index % hymnsData.length);
    setUnscrambleFeedback(null);
  }

  function handleQuizAnswer(option) {
    const hymn = hymns[quizIndex];
    const correct = hymn.deities && hymn.deities.length ? hymn.deities[0] : "Unknown";
    const correctBool = option === correct;
    setQuizAnswered(true);
    setQuizCorrect(correctBool);
    if (correctBool) {
      setScore((s) => s + 10);
      // Award a card on correct answers if the parent provided the hook
      props?.grantRandomCard?.();
    } else {
      setScore((s) => Math.max(0, s - 2));
    }
  }

  function nextQuizQuestion() {
    const next = (quizIndex + 1) % hymns.length;
    // Also award every 5th question to make testing easier even with wrong answers
    if ((quizIndex + 1) % 5 === 0) {
      props?.grantRandomCard?.();
    }
    prepareQuiz(next);
  }

  function pickWord(word) {
    if (!poolWords.includes(word)) return;
    setPoolWords((p) => p.filter((w) => w !== word));
    setBuiltWords((b) => [...b, word]);
  }

  function removeBuiltAt(index) {
    const removed = builtWords[index];
    setBuiltWords((b) => b.filter((_, i) => i !== index));
    setPoolWords((p) => [...p, removed]);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const word = active.id;
    if (over.id === "built" && poolWords.includes(word)) {
      setPoolWords((p) => p.filter((w) => w !== word));
      setBuiltWords((b) => [...b, word]);
    } else if (over.id === "pool" && builtWords.includes(word)) {
      setBuiltWords((b) => {
        const idx = b.indexOf(word);
        if (idx === -1) return b;
        const copy = [...b];
        copy.splice(idx, 1);
        return copy;
      });
      setPoolWords((p) => [...p, word]);
    }
  }

  function submitUnscramble() {
    const hymn = hymns[unscrambleHymnIndex];
    const correct = splitSanskritWords(hymn.sanskrit || hymn.translation || "").join(" ");
    const user = builtWords.join(" ");
    if (user === correct) {
      setUnscrambleFeedback({ ok: true, message: "Perfect — verse reconstructed!" });
      setScore((s) => s + 15);
      // Optional: award on successful unscramble too
      props?.grantRandomCard?.();
    } else {
      setUnscrambleFeedback({ ok: false, message: "Not quite correct — try again." });
      setScore((s) => Math.max(0, s - 3));
    }
  }

  function resetUnscramble() {
    prepareUnscramble(unscrambleHymnIndex);
  }

  function addToLeaderboard(name) {
    const entry = { name: name || "Anonymous", score, date: new Date().toISOString() };
    const updated = shuffle([entry, ...leaderboard])
      .slice(0, 50)
      .sort((a, b) => b.score - a.score);
    setLeaderboard(updated);
    localStorage.setItem("rigveda_leaderboard_v1", JSON.stringify(updated));
  }

  function startDailyChallenge() {
    const pickMode = Math.random() > 0.5 ? "quiz" : "unscramble";
    setMode(pickMode);
    const idx = Math.floor(Math.random() * Math.max(1, hymns.length));
    if (pickMode === "quiz") prepareQuiz(idx);
    else prepareUnscramble(idx);
    setScore(0);
  }

  const currentQuizHymn = hymns[quizIndex] || null;
  const currentUnscrambleHymn = hymns[unscrambleHymnIndex] || null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8E7] to-[#E9D8A6]">
        <div className="text-2xl font-semibold">Loading hymns…</div>
      </div>
    );
  }

  const totalQuestions = hymns.length || 0;
  const questionNumber = totalQuestions ? quizIndex + 1 : 0;

  return (
    <div className="quiz-page rv-main">
      <header className="quiz-header">
        <h1>🕉️ Rigvedic Challenge Arena</h1>
        <p>Choose a challenge — match a deity to a hymn or unscramble a sacred verse.</p>
      </header>

      <div className="mode-buttons">
        <button onClick={() => setMode("quiz")} className={mode === "quiz" ? "active" : ""}>
          Quiz
        </button>
        <button
          onClick={() => setMode("unscramble")}
          className={mode === "unscramble" ? "active" : ""}
        >
          Unscramble
        </button>
        <button onClick={startDailyChallenge}>Daily</button>
      </div>

      <div className="quiz-container">
        {mode === "quiz" ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Match the Deity</h2>
              <div
                style={{
                  fontWeight: 700,
                  color: "#6b4f2a",
                  background: "#FFF1CC",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid #FBD38D"
                }}
              >
                Question {questionNumber} of {totalQuestions}
              </div>
            </div>

            <p className="text-sm text-stone-700 mb-3">
              Which deity is primarily praised in this hymn?
            </p>
            <div className="sanskrit-verse">
              {currentQuizHymn?.sanskrit || currentQuizHymn?.translation || "—"}
            </div>

            {quizOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleQuizAnswer(opt)}
                disabled={quizAnswered}
                className={`option-button ${
                  quizAnswered
                    ? opt === (currentQuizHymn?.deities?.[0] ?? "")
                      ? "correct"
                      : "wrong"
                    : ""
                }`}
              >
                {opt}
              </button>
            ))}

            {quizAnswered && (
              <div className="mt-3">
                <div>
                  <strong>{quizCorrect ? "✅ Correct!" : "❌ Incorrect!"}</strong>{" "}
                  {generateLifeLesson(currentQuizHymn)}
                </div>
                <button className="option-button mt-3" onClick={nextQuizQuestion}>
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2>Unscramble Verse</h2>
            <p>Arrange the divine stones in the right order.</p>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              {/* BUILT droppable target */}
              <DroppableArea id="built" className="unscramble-box">
                {builtWords.length === 0 && <div>(empty)</div>}
                {builtWords.map((w, idx) => (
                  <div key={idx} className="word-tile" onClick={() => removeBuiltAt(idx)}>
                    {w}
                  </div>
                ))}
              </DroppableArea>

              {/* POOL droppable target */}
              <DroppableArea id="pool" className="unscramble-box mt-3">
                {poolWords.map((w) => (
                  <DnDWord key={w} id={w} word={w} onClick={() => pickWord(w)} />
                ))}
              </DroppableArea>
            </DndContext>

            <div className="mt-3">
              <button onClick={submitUnscramble} className="option-button">
                Submit
              </button>
              <button onClick={resetUnscramble} className="option-button">
                Reset
              </button>
              {unscrambleFeedback && (
                <div
                  className={`mt-2 p-2 rounded ${
                    unscrambleFeedback.ok ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {unscrambleFeedback.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
