'use client'

import { useEffect, useRef, useState } from 'react'

export default function CinematicBirthday() {
  const [phase, setPhase] = useState(0)
  const [muted, setMuted] = useState(true)
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const phases = [
    { duration: 3000 },
    { duration: 4000 },
    { duration: 4000 },
    { duration: 5000 },
    { duration: Infinity },
  ]

  function start() {
    setStarted(true)
    setPhase(1)
  }

  useEffect(() => {
    if (!started || phase === 0 || phase >= phases.length - 1) return
    const timer = setTimeout(
      () => setPhase((p) => p + 1),
      phases[phase].duration
    )
    return () => clearTimeout(timer)
  }, [phase, started])

  const candles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: ((i * 13.7) % 80) + 10,
    delay: (i * 0.3) % 3,
    duration: ((i * 0.7) % 1.5) + 2,
    size: ((i * 7) % 12) + 8,
  }))

  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: (i * 6.18) % 100,
    top: (i * 9.37) % 100,
    size: ((i * 3) % 3) + 1,
    delay: (i * 0.4) % 5,
    duration: ((i * 0.8) % 3) + 2,
  }))

  const petals = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: (i * 4.17) % 100,
    delay: (i * 0.5) % 6,
    duration: ((i * 0.9) % 4) + 5,
    size: ((i * 5) % 16) + 8,
    rotation: (i * 37) % 360,
  }))

  return (
    <div className="scene" ref={containerRef}>
      {/* Stars background */}
      <div className={`stars ${phase >= 1 ? 'visible' : ''}`}>
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Falling petals phase 4+ */}
      {phase >= 4 && (
        <div className="petals">
          {petals.map((p) => (
            <div
              key={p.id}
              className="petal"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Candles phase 2+ */}
      {phase >= 2 && (
        <div className={`candles ${phase >= 2 ? 'visible' : ''}`}>
          {candles.map((c) => (
            <div
              key={c.id}
              className="candle"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                width: `${c.size}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Phase 0 — black void */}
      <div
        className={`overlay void ${phase === 0 && !started ? 'active' : ''}`}
      >
        <button className="startBtn" onClick={start}>
          <span className="startRing" />
          <span className="startText">Open</span>
        </button>
      </div>

      {/* Phase 1 — name reveal */}
      <div className={`overlay phase1 ${phase === 1 ? 'active' : ''}`}>
        <div className="nameReveal">
          <div className="forYou">for</div>
          <div className="recipientName">Sina</div>
        </div>
      </div>

      {/* Phase 2 — date & occasion */}
      <div className={`overlay phase2 ${phase === 2 ? 'active' : ''}`}>
        <div className="occasionWrap">
          <div className="occasionTag">🎂 Birthday</div>
          <div className="occasionDate">May 12 · 2026</div>
          <div className="occasionFrom">from Adham</div>
        </div>
      </div>

      {/* Phase 3 — message */}
      <div className={`overlay phase3 ${phase === 3 ? 'active' : ''}`}>
        <div className="messageWrap">
          <div className="quoteOpen">"</div>
          <p className="messageText">
            Happy birthday, Sina. I only want to see you as the best person in
            the whole world. You deserve every beautiful thing life has to
            offer.
          </p>
          <div className="messageSig">— Adham</div>
        </div>
      </div>

      {/* Phase 4 — final celebration */}
      <div className={`overlay phase4 ${phase >= 4 ? 'active' : ''}`}>
        <div className="celebrationWrap">
          <div className="bigWish">Happy</div>
          <div className="bigWishBold">Birthday</div>
          <div className="bigWishName">Sina ♥</div>
          <div className="celebrationSub">May all your dreams come true</div>

          <div className="photoGrid">
            <div className="photoSlot p1" />
            <div className="photoSlot p2" />
            <div className="photoSlot p3" />
          </div>
        </div>
      </div>

      {/* Controls */}
      {started && (
        <div className="controls">
          <button className="muteBtn" onClick={() => setMuted(!muted)}>
            {muted ? '♪' : '♫'}
          </button>
          {phase >= 4 && (
            <button
              className="replayBtn"
              onClick={() => {
                setPhase(1)
              }}
            >
              ↺
            </button>
          )}
        </div>
      )}

      {/* Made with Memora */}
      {started && (
        <a href="/" className="madeWith">
          Made with Memora
        </a>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');

        .scene {
          position: fixed;
          inset: 0;
          background: oklch(0.05 0.01 330);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* STARS */
        .stars {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 2s ease;
          pointer-events: none;
        }
        .stars.visible {
          opacity: 1;
        }

        .star {
          position: absolute;
          border-radius: 50%;
          background: oklch(0.92 0.02 60);
          animation: twinkle ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        /* CANDLES */
        .candles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.5s ease;
        }
        .candles.visible {
          opacity: 1;
        }

        .candle {
          position: absolute;
          bottom: 0;
          height: 60px;
          background: linear-gradient(
            to top,
            oklch(0.55 0.15 30),
            oklch(0.72 0.18 45)
          );
          border-radius: 3px 3px 0 0;
          animation: candleFlicker ease-in-out infinite;
        }
        .candle::after {
          content: '';
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 14px;
          background: radial-gradient(
            ellipse at 50% 80%,
            oklch(0.98 0.05 80),
            oklch(0.85 0.18 60) 40%,
            oklch(0.65 0.22 35) 80%,
            transparent
          );
          border-radius: 50% 50% 30% 30%;
          filter: blur(1px);
          animation: flameDance ease-in-out infinite;
          animation-duration: inherit;
          animation-delay: inherit;
        }
        @keyframes candleFlicker {
          0%,
          100% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes flameDance {
          0%,
          100% {
            transform: translateX(-50%) scaleX(1) scaleY(1);
          }
          33% {
            transform: translateX(-48%) scaleX(0.85) scaleY(1.1);
          }
          66% {
            transform: translateX(-52%) scaleX(1.1) scaleY(0.92);
          }
        }

        /* PETALS */
        .petals {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .petal {
          position: absolute;
          top: -20px;
          border-radius: 50% 0 50% 0;
          background: oklch(0.72 0.18 0);
          opacity: 0.7;
          animation: petalFall linear infinite;
        }
        @keyframes petalFall {
          from {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0.8;
          }
          to {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* OVERLAYS */
        .overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 1.5s ease;
          pointer-events: none;
        }
        .overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* PHASE 0 — open button */
        .void {
          background: oklch(0.05 0.01 330);
          z-index: 10;
          transition: opacity 2s ease;
        }

        .startBtn {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1px solid oklch(0.72 0.18 0 / 0.4);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s ease;
        }
        .startBtn:hover {
          transform: scale(1.08);
        }
        .startBtn:hover .startRing {
          transform: scale(1.15);
          opacity: 0.6;
        }

        .startRing {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1px solid oklch(0.72 0.18 0 / 0.2);
          transition:
            transform 0.4s ease,
            opacity 0.4s ease;
          animation: pulseRing 3s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        .startText {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: oklch(0.92 0.02 60);
          letter-spacing: 0.15em;
        }

        /* PHASE 1 — name */
        .phase1 {
          flex-direction: column;
          gap: 8px;
        }
        .forYou {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(14px, 2vw, 18px);
          font-weight: 300;
          color: oklch(0.72 0.18 0);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          animation: fadeSlideUp 1.2s ease both;
        }
        .recipientName {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(72px, 14vw, 160px);
          font-weight: 300;
          font-style: italic;
          color: oklch(0.96 0.01 60);
          line-height: 0.85;
          letter-spacing: -0.02em;
          animation: fadeSlideUp 1.2s 0.3s ease both;
        }

        /* PHASE 2 — occasion */
        .phase2 {
          flex-direction: column;
        }
        .occasionWrap {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }
        .occasionTag {
          font-size: clamp(28px, 5vw, 48px);
          animation: fadeSlideUp 1s ease both;
        }
        .occasionDate {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 6vw, 72px);
          font-weight: 300;
          color: oklch(0.96 0.01 60);
          letter-spacing: 0.05em;
          animation: fadeSlideUp 1s 0.3s ease both;
        }
        .occasionFrom {
          font-size: clamp(12px, 1.5vw, 16px);
          color: oklch(0.72 0.18 0);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 300;
          animation: fadeSlideUp 1s 0.6s ease both;
        }

        /* PHASE 3 — message */
        .phase3 {
          padding: 40px;
        }
        .messageWrap {
          max-width: 680px;
          text-align: center;
        }
        .quoteOpen {
          font-family: 'Cormorant Garamond', serif;
          font-size: 80px;
          color: oklch(0.72 0.18 0);
          line-height: 0.4;
          margin-bottom: 24px;
          opacity: 0.5;
          animation: fadeSlideUp 1s ease both;
        }
        .messageText {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 3vw, 32px);
          font-weight: 300;
          font-style: italic;
          color: oklch(0.92 0.01 60);
          line-height: 1.6;
          margin-bottom: 28px;
          animation: fadeSlideUp 1s 0.3s ease both;
        }
        .messageSig {
          font-size: clamp(12px, 1.5vw, 15px);
          color: oklch(0.72 0.18 0);
          letter-spacing: 0.15em;
          animation: fadeSlideUp 1s 0.6s ease both;
        }

        /* PHASE 4 — celebration */
        .phase4 {
          flex-direction: column;
          gap: 0;
        }
        .celebrationWrap {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .bigWish {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 4vw, 48px);
          font-weight: 300;
          color: oklch(0.72 0.18 0);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          animation: fadeSlideUp 1s ease both;
        }
        .bigWishBold {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(64px, 13vw, 140px);
          font-weight: 300;
          color: oklch(0.96 0.01 60);
          line-height: 0.85;
          letter-spacing: -0.02em;
          animation: fadeSlideUp 1s 0.2s ease both;
        }
        .bigWishName {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 6vw, 72px);
          font-weight: 300;
          font-style: italic;
          color: oklch(0.72 0.18 0);
          margin-top: 8px;
          animation: fadeSlideUp 1s 0.4s ease both;
        }
        .celebrationSub {
          font-size: clamp(11px, 1.5vw, 14px);
          color: oklch(0.55 0.05 60);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 20px;
          animation: fadeSlideUp 1s 0.6s ease both;
        }

        .photoGrid {
          display: flex;
          gap: 12px;
          margin-top: 36px;
          animation: fadeSlideUp 1s 0.8s ease both;
        }
        .photoSlot {
          border-radius: 12px;
          background: oklch(0.12 0.02 330);
          border: 1px solid oklch(0.72 0.18 0 / 0.15);
        }
        .p1 {
          width: 100px;
          height: 130px;
        }
        .p2 {
          width: 100px;
          height: 130px;
          margin-top: -20px;
        }
        .p3 {
          width: 100px;
          height: 130px;
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* CONTROLS */
        .controls {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          gap: 10px;
          z-index: 20;
        }
        .muteBtn,
        .replayBtn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid oklch(0.72 0.18 0 / 0.3);
          background: oklch(0.08 0.01 330 / 0.8);
          color: oklch(0.72 0.18 0);
          font-size: 16px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: 0.2s ease;
        }
        .muteBtn:hover,
        .replayBtn:hover {
          border-color: oklch(0.72 0.18 0 / 0.7);
          background: oklch(0.12 0.02 330 / 0.9);
        }

        /* MADE WITH MEMORA */
        .madeWith {
          position: fixed;
          bottom: 24px;
          left: 24px;
          font-size: 10px;
          color: oklch(0.4 0.05 330);
          text-decoration: none;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          z-index: 20;
          transition: 0.2s ease;
        }
        .madeWith:hover {
          color: oklch(0.72 0.18 0);
        }
      `}</style>
    </div>
  )
}
