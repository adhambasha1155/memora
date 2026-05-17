'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase'

const TEMPLATES = [
  {
    id: 1,
    slug: 'cinematic',
    name: 'Cinematic',
    mood: 'Dark & emotional',
    description:
      'Dark, dramatic, and deeply emotional. Perfect for grand milestones and unforgettable moments.',
    accent: '#c2185b',
    bg: '#1a0a0a',
    textColor: '#fff',
    particles: ['✦', '✧', '★'],
    previewLines: ['#c2185b', '#7a1733', '#2c0a14'],
  },
  {
    id: 2,
    slug: 'romantic',
    name: 'Romantic',
    mood: 'Soft & warm',
    description:
      'Soft, warm, and elegant. Designed for love stories, anniversaries, and tender memories.',
    accent: '#e91e8c',
    bg: '#fff0f5',
    textColor: '#2c1a20',
    particles: ['♥', '✿', '❀'],
    previewLines: ['#f9c8d8', '#e91e8c', '#f9e4ec'],
  },
  {
    id: 3,
    slug: 'playful',
    name: 'Playful',
    mood: 'Bright & fun',
    description:
      'Bright, fun, and energetic. Ideal for birthdays, graduations, and joyful celebrations.',
    accent: '#ff6b6b',
    bg: '#fff8e1',
    textColor: '#2c1a20',
    particles: ['🎉', '⭐', '✨'],
    previewLines: ['#ffd93d', '#ff6b6b', '#6bcb77'],
  },
  {
    id: 4,
    slug: 'elegant',
    name: 'Elegant',
    mood: 'Clean & refined',
    description:
      'Minimal, clean, and refined. For those who appreciate subtle beauty and understated grace.',
    accent: '#8b6f5e',
    bg: '#f8f4f0',
    textColor: '#2c1a20',
    particles: ['◆', '◇', '▪'],
    previewLines: ['#d4c4b8', '#8b6f5e', '#f0e8e0'],
  },
  {
    id: 5,
    slug: 'minimal',
    name: 'Minimal',
    mood: 'Ultra clean',
    description:
      'Ultra clean and text-focused. Let your words take center stage with pure simplicity.',
    accent: '#333',
    bg: '#fafafa',
    textColor: '#1a1a1a',
    particles: ['—', '·', '○'],
    previewLines: ['#333', '#999', '#ddd'],
  },
]

export default function PickPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleChoose(templateId: number) {
    if (isLoggedIn) {
      router.push(`/create/${templateId}`)
    } else {
      router.push('/signup')
    }
  }

  return (
    <main className="pickPage">
      {/* Navbar */}
      <nav className={`pickNav ${scrolled ? 'scrolled' : ''}`}>
        <div className="pickNavInner">
          <Link href="/" className="dashBrand">
            <img src="/memora-logo.png" alt="Memora" className="logo" />
          </Link>
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="backBtn">
            {isLoggedIn ? '← Back to account' : '← Home'}
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="pickHeader">
        <div className="pickHeaderBadge">✦ Step 1 of 5</div>
        <h1 className="pickTitle">
          Choose your <span>Memora</span>
        </h1>
        <p className="pickSub">
          Each template is a complete cinematic experience. Pick the one that
          feels right — you&apos;ll add your memories next.
        </p>
      </div>

      {/* Templates */}
      <div className="templatesList">
        {TEMPLATES.map((t, index) => (
          <div
            key={t.id}
            className={`templateRow ${hoveredId === t.id ? 'hovered' : ''} ${index % 2 === 1 ? 'reversed' : ''}`}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Preview */}
            <div className="previewWrap">
              <div className="previewCard" style={{ background: t.bg }}>
                <div className="previewInner">
                  {/* Decorative lines */}
                  <div className="previewLines">
                    {t.previewLines.map((color, i) => (
                      <div
                        key={i}
                        className="previewLine"
                        style={{
                          background: color,
                          width: i === 0 ? '60%' : i === 1 ? '40%' : '50%',
                          opacity: hoveredId === t.id ? 1 : 0.5,
                          transitionDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Floating particles */}
                  <div className="particlesWrap">
                    {t.particles.map((p, i) => (
                      <span
                        key={i}
                        className={`particle p${i}`}
                        style={{
                          color: t.accent,
                          animationPlayState:
                            hoveredId === t.id ? 'running' : 'paused',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Center mock content */}
                  <div className="previewMock">
                    <div className="mockDot" style={{ background: t.accent }} />
                    <div className="mockText">
                      <div
                        className="mockLine long"
                        style={{ background: t.accent, opacity: 0.7 }}
                      />
                      <div
                        className="mockLine short"
                        style={{ background: t.accent, opacity: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Template name watermark */}
                  <div className="previewWatermark" style={{ color: t.accent }}>
                    {t.name}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="previewOverlay">
                  <button
                    className="useBtn"
                    style={{ background: t.accent }}
                    onClick={() => handleChoose(t.id)}
                  >
                    Use this template →
                  </button>
                </div>
              </div>

              {/* Number */}
              <div className="templateNumber">0{t.id}</div>
            </div>

            {/* Info */}
            <div className="templateInfo">
              <div
                className="templateMoodBadge"
                style={{ color: t.accent, borderColor: t.accent }}
              >
                {t.mood}
              </div>
              <h2 className="templateName">{t.name}</h2>
              <p className="templateDesc">{t.description}</p>
              <button
                className="templateChooseBtn"
                style={{
                  background: hoveredId === t.id ? t.accent : 'transparent',
                  color: hoveredId === t.id ? '#fff' : t.accent,
                  borderColor: t.accent,
                }}
                onClick={() => handleChoose(t.id)}
              >
                Choose {t.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pickPage {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          --rose-mid: #e8809e;

          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(249, 228, 236, 0.9),
              transparent 35%
            ),
            radial-gradient(
              circle at 85% 15%,
              rgba(232, 128, 158, 0.15),
              transparent 30%
            ),
            var(--warm-white);
        }

        /* NAV — transparent by default, frosted on scroll */
        .pickNav {
          padding: 0 48px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: transparent;
          transition:
            background 0.3s ease,
            backdrop-filter 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .pickNav.scrolled {
          background: rgba(253, 245, 247, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(194, 24, 91, 0.08);
          box-shadow: 0 4px 20px rgba(194, 24, 91, 0.06);
        }

        .pickNavInner {
          max-width: 1100px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashBrand {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .logo {
          height: 56px;
          width: auto;
          object-fit: contain;
        }

        .backBtn {
          font-size: 12px;
          font-weight: 600;
          color: var(--dusty-rose);
          text-decoration: none;
          transition: color 0.2s;
        }

        .backBtn:hover {
          color: var(--main-rose);
        }

        /* HEADER — top padding accounts for fixed nav */
        .pickHeader {
          text-align: center;
          padding: 136px 24px 56px;
          max-width: 600px;
          margin: 0 auto;
        }

        .pickHeaderBadge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--rose-blush);
          border: 1px solid rgba(194, 24, 91, 0.15);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: var(--main-rose);
          letter-spacing: 0.06em;
          margin-bottom: 20px;
        }

        .pickTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5vw, 56px);
          font-weight: 700;
          color: var(--dark-plum);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .pickTitle span {
          color: var(--main-rose);
          font-style: italic;
        }

        .pickSub {
          font-size: 15px;
          color: var(--dusty-rose);
          line-height: 1.7;
          font-weight: 300;
        }

        /* TEMPLATES LIST */
        .templatesList {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px 120px;
          display: flex;
          flex-direction: column;
          gap: 80px;
        }

        .templateRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          animation: fadeUp 0.6s ease both;
        }

        .templateRow.reversed {
          direction: rtl;
        }

        .templateRow.reversed > * {
          direction: ltr;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* PREVIEW */
        .previewWrap {
          position: relative;
        }

        .previewCard {
          border-radius: 24px;
          height: 380px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(194, 24, 91, 0.1);
          box-shadow: 0 20px 60px rgba(44, 26, 32, 0.1);
          transition:
            transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            box-shadow 0.4s ease;
          cursor: pointer;
        }

        .hovered .previewCard {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 32px 80px rgba(44, 26, 32, 0.18);
        }

        .previewInner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 24px;
          padding: 32px;
          position: relative;
        }

        .previewLines {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          padding: 0 24px;
        }

        .previewLine {
          height: 4px;
          border-radius: 999px;
          transition: all 0.4s ease;
          transform-origin: left;
        }

        .hovered .previewLine {
          transform: scaleX(1.1);
        }

        .particlesWrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          font-size: 20px;
          animation: particleFloat 3s ease-in-out infinite;
          animation-play-state: paused;
          opacity: 0.6;
        }

        .p0 {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }
        .p1 {
          top: 60%;
          right: 18%;
          animation-delay: 0.8s;
        }
        .p2 {
          bottom: 20%;
          left: 30%;
          animation-delay: 1.6s;
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-18px) rotate(10deg);
            opacity: 1;
          }
        }

        .previewMock {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          width: 100%;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .mockDot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .mockText {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mockLine {
          height: 3px;
          border-radius: 999px;
        }

        .mockLine.long {
          width: 70%;
        }
        .mockLine.short {
          width: 45%;
        }

        .previewWatermark {
          position: absolute;
          bottom: 16px;
          right: 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 600;
          opacity: 0.35;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .previewOverlay {
          position: absolute;
          inset: 0;
          background: rgba(44, 26, 32, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .hovered .previewOverlay {
          opacity: 1;
        }

        .useBtn {
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 999px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transform: translateY(12px);
          transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        .hovered .useBtn {
          transform: translateY(0);
        }

        .templateNumber {
          position: absolute;
          top: -20px;
          left: -16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 80px;
          font-weight: 700;
          color: rgba(194, 24, 91, 0.08);
          line-height: 1;
          pointer-events: none;
          z-index: -1;
          transition: color 0.3s ease;
        }

        .hovered .templateNumber {
          color: rgba(194, 24, 91, 0.15);
        }

        /* INFO */
        .templateInfo {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .templateMoodBadge {
          display: inline-block;
          padding: 5px 14px;
          border: 1px solid;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          width: fit-content;
          transition: all 0.3s ease;
        }

        .hovered .templateMoodBadge {
          background: var(--rose-blush);
        }

        .templateName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--dark-plum);
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0;
          transition: color 0.3s ease;
        }

        .hovered .templateName {
          color: var(--main-rose);
        }

        .templateDesc {
          font-size: 15px;
          color: var(--dusty-rose);
          line-height: 1.7;
          font-weight: 300;
          margin: 0;
        }

        .templateChooseBtn {
          width: fit-content;
          padding: 12px 28px;
          border: 1.5px solid;
          border-radius: 999px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .templateChooseBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 24, 91, 0.2);
        }

        .templateRow:not(:last-child)::after {
          content: '';
          display: block;
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(194, 24, 91, 0.15),
            transparent
          );
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .pickNav {
            padding: 0 20px;
          }

          .pickHeader {
            padding: 104px 20px 40px;
          }

          .templatesList {
            padding: 0 20px 80px;
            gap: 56px;
          }

          .templateRow,
          .templateRow.reversed {
            grid-template-columns: 1fr;
            direction: ltr;
            gap: 24px;
          }

          .previewCard {
            height: 260px;
          }
          .templateName {
            font-size: 36px;
          }

          .templateNumber {
            font-size: 56px;
            top: -14px;
            left: -10px;
          }
        }
      `}</style>
    </main>
  )
}
