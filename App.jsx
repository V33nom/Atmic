import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Components/Header';
import Hero from './Components/Hero';
import Features from './Components/Features';
import Footer from './Components/Footer';
import Aboutus from './Components/Aboutus';
import Explorer from './pages/Explorer';
import Narration from './pages/Narration';
import Quiz from './pages/Quiz';
import Chatbot from './pages/Chatbot';
import DailyWisdom from './pages/DailyWisdom';
import Api from "./pages/Api";

// Wisdom Card System Imports
import { deityCards } from "./pages/deityCards";
import CardCollection from "./pages/CardCollection";
import WisdomCardModal from "./pages/wisdomcardmodal";

function getSavedCards() {
  const saved = localStorage.getItem("wisdom_cards");
  return saved ? JSON.parse(saved) : [];
}

function App() {
  const [unlocked, setUnlocked] = useState(getSavedCards());
  const [modalCard, setModalCard] = useState(null);

  useEffect(() => {
    localStorage.setItem("wisdom_cards", JSON.stringify(unlocked));
  }, [unlocked]);

  // Central function for giving cards (pass as prop if needed)
  const grantRandomCard = useCallback(() => {
    const available = deityCards.filter(c => !unlocked.includes(c.id));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setUnlocked(prev => [...prev, random.id]);
      setModalCard(random);
    }
  }, [unlocked]);

  const handleCloseModal = () => setModalCard(null);

  return (
    <BrowserRouter>
      <div className="rv-main">
        <Header />
        <main className="rv-content-area">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Aboutus />
                <Features />
              </>
            } />
            <Route path="/explorer" element={
              <Explorer grantRandomCard={grantRandomCard} />
            } />
            <Route path="/narration" element={
              <Narration grantRandomCard={grantRandomCard} />
            } />
            <Route path="/quiz" element={
              <Quiz grantRandomCard={grantRandomCard} />
            } />
           <Route path="/chatbot" element={<Chatbot grantRandomCard={grantRandomCard} />} />

            <Route path="/dailywisdom" element={<DailyWisdom />} />
            <Route path="/cards" element={
              <CardCollection unlocked={unlocked} />
            } />
            <Route path="/themes" element={<h1 style={{ textAlign: 'center', marginTop: 100 }}>Themes Page Coming Soon</h1>} />
            <Route path="/api" element={<Api />} />  {/* ✅ Actually use it here */}
          </Routes>
        </main>
        <WisdomCardModal card={modalCard} onClose={handleCloseModal} />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
