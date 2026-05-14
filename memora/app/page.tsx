'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: ((i * 7) % 5) + 2,
  left: (i * 5.55) % 100,
  top: (i * 7.3) % 100,
  duration: ((i * 1.3) % 12) + 8,
  delay: (i * 0.7) % 8,
}))

const steps = [
  {
    num: '01',
    title: 'Pick a template',
    desc: 'Browse 5 cinematic templates and choose the one that matches your moment.',
  },
  {
    num: '02',
    title: 'Add your memories',
    desc: 'Upload photos, videos, write your message and add background music.',
  },
  {
    num: '03',
    title: 'Share the link',
    desc: 'Get a beautiful shareable link. Anyone can view it, only you can edit it.',
  },
]

const templates = [
  {
    id: 1,
    name: 'Cinematic',
    mood: 'Dark & emotional',
    color: '#1a0a0a',
    accent: '#c2185b',
  },
  {
    id: 2,
    name: 'Romantic',
    mood: 'Soft & warm',
    color: '#fff0f5',
    accent: '#e91e8c',
  },
  {
    id: 3,
    name: 'Playful',
    mood: 'Bright & fun',
    color: '#fff8e1',
    accent: '#ff6b6b',
  },
  {
    id: 4,
    name: 'Elegant',
    mood: 'Clean & refined',
    color: '#f8f4f0',
    accent: '#8b6f5e',
  },
  {
    id: 5,
    name: 'Minimal',
    mood: 'Ultra clean',
    color: '#fafafa',
    accent: '#333',
  },
]

const proofs = [
  { name: 'Nour & Sara', occasion: 'Anniversary', views: '1.2k', emoji: '💍' },
  {
    name: 'Happy Birthday Layla',
    occasion: 'Birthday',
    views: '847',
    emoji: '🎂',
  },
  {
    name: 'Graduation Day 2025',
    occasion: 'Graduation',
    views: '2.1k',
    emoji: '🎓',
  },
]

export default function LandingPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="root">
      <div className="pageContent">
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="navInner">
            <span className="navBrand">
              <img src="/memora-logo.png" alt="Memora" className="logo" />
            </span>
            <div className="navActions">
              {user ? (
                <Link href="/dashboard" className="accountIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </Link>
              ) : (
                <Link href="/signup" className="accountIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="heroParticles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>
          <div className="heroContent">
            <div className="heroBadge">✦ Memory websites, beautifully made</div>
            <h1 className="heroTitle">
              Turn your memories
              <br />
              into an <em>experience.</em>
            </h1>
            <p className="heroSub">
              Create cinematic, interactive websites for the moments that matter
              —<br />
              birthdays, anniversaries, graduations and everything in between.
            </p>
            <div className="heroCtas">
              <Link href="/signup" className="ctaPrimary">
                Create yours free
              </Link>
              <a href="#templates" className="ctaGhost">
                See examples ↓
              </a>
            </div>
          </div>
        </section>

        <section className="howSection">
          <div className="sectionInner">
            <div className="sectionLabel">HOW IT WORKS</div>
            <h2 className="sectionTitle">Three steps to something beautiful</h2>
            <div className="stepsGrid">
              {steps.map((step) => (
                <div key={step.num} className="stepCard">
                  <div className="stepNum">{step.num}</div>
                  <h3 className="stepTitle">{step.title}</h3>
                  <p className="stepDesc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="templatesSection" id="templates">
          <div className="sectionInner">
            <div className="sectionLabel">TEMPLATES</div>
            <h2 className="sectionTitle">Five ways to tell your story</h2>
            <p className="sectionSub">
              Each template is a complete cinematic experience. Pick the one
              that feels right.
            </p>
            <div className="sliderWrapper">
              <div className="templatesGrid">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className={`templateCard ${hoveredId === t.id ? 'hovered' : ''}`}
                    style={
                      {
                        '--card-bg': t.color,
                        '--card-accent': t.accent,
                      } as React.CSSProperties
                    }
                    onMouseEnter={() => setHoveredId(t.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="templatePreview">
                      <div className="templateDot" />
                      <div className="templateLines">
                        <div className="templateLine long" />
                        <div className="templateLine short" />
                        <div className="templateLine medium" />
                      </div>
                    </div>
                    <div className="templateInfo">
                      <div className="templateName">{t.name}</div>
                      <div className="templateMood">{t.mood}</div>
                    </div>
                    <div className="templateHoverOverlay">
                      <Link
                        href="/pick"
                        className="templateHoverBtn"
                        style={{ backgroundColor: t.accent }}
                      >
                        Preview →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="proofSection">
          <div className="sectionInner">
            <div className="sectionLabel">MADE WITH MEMORA</div>
            <h2 className="sectionTitle">Real moments, real people</h2>
            <div className="sliderWrapper">
              <div className="proofGrid">
                {proofs.map((p) => (
                  <div key={p.name} className="proofCard">
                    <div className="proofEmoji">{p.emoji}</div>
                    <div className="proofName">{p.name}</div>
                    <div className="proofOccasion">{p.occasion}</div>
                    <div className="proofViews">♥ {p.views} views</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="testimonial">
              <div className="quoteMarks"></div>
              <p className="quoteText">
                Memora turned a folder of photos into something I actually look
                at every single day.
              </p>
              <div className="quoteAuthor">
                Nour Khalil · Designer, Alexandria
              </div>
            </div>
          </div>
        </section>

        <section className="ctaSection">
          <div className="ctaInner">
            <div className="ctaTextContent">
              <h2 className="ctaTitle">
                Start crafting your
                <br />
                <em>memories today.</em>
              </h2>
            </div>
            <Link href="/signup" className="ctaBigBtn">
              Create your first Memora →
            </Link>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerLogo">
              <img src="/memora-logo.png" alt="Memora" className="logoFooter" />
            </div>
            <div className="footerTagline">
              Crafting meaningful memories,
              <br />
              one moment at a time.
            </div>
          </div>
          <div className="footerCols">
            <div className="footerCol">
              <div className="footerColTitle">PRODUCT</div>
              <a href="#templates">Templates</a>
              <a href="#how">How it works</a>
              <Link href="/signup">Pricing</Link>
            </div>
            <div className="footerCol">
              <div className="footerColTitle">COMPANY</div>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footerCol">
              <div className="footerColTitle">SUPPORT</div>
              <a href="#">Help center</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className="footerBottom">
          <span>© 2026 Memora. All rights reserved.</span>
          <span>Made with ♥</span>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .root {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          overflow-x: hidden;
        }

        .pageContent {
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
            radial-gradient(
              circle at 50% 95%,
              rgba(194, 24, 91, 0.06),
              transparent 40%
            ),
            var(--warm-white);
          min-height: 100vh;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 24px;
          transition: all 0.3s ease;
          background: transparent;
        }
        .navbar.scrolled {
          background: rgba(253, 245, 247, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(194, 24, 91, 0.08);
          box-shadow: 0 4px 20px rgba(194, 24, 91, 0.06);
        }
        .navInner {
          max-width: 1100px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navBrand {
          display: flex;
          align-items: center;
        }
        .logo {
          height: 63px;
          width: auto;
          object-fit: contain;
        }
        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .accountIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(194, 24, 91, 0.2);
          color: var(--main-rose);
          text-decoration: none;
          transition: 0.2s ease;
        }
        .accountIcon:hover {
          background: var(--rose-blush);
          border-color: var(--main-rose);
        }

        .hero {
          min-height: 100vh;
          padding: 120px 24px 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }
        .heroParticles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(194, 24, 91, 0.12);
          animation: particleFloat ease-in-out infinite;
        }
        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }
        .heroContent {
          max-width: 800px;
          z-index: 1;
          animation: fadeUp 0.8s ease forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
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
        .heroBadge {
          padding: 6px 14px;
          background: rgba(194, 24, 91, 0.08);
          border: 1px solid rgba(194, 24, 91, 0.15);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          color: var(--main-rose);
          margin-bottom: 24px;
        }
        .heroTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.05;
          color: var(--dark-plum);
          margin-bottom: 20px;
        }
        .heroTitle em {
          font-style: italic;
          color: var(--main-rose);
        }
        .heroSub {
          font-size: 14px;
          line-height: 1.7;
          color: var(--dusty-rose);
          margin-bottom: 32px;
        }
        .heroCtas {
          display: flex;
          gap: 14px;
          justify-content: center;
          align-items: center;
        }
        .ctaPrimary {
          padding: 14px 28px;
          background: var(--main-rose);
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(194, 24, 91, 0.25);
        }
        .ctaGhost {
          padding: 14px 24px;
          border: 1px solid rgba(138, 100, 112, 0.2);
          border-radius: 999px;
          font-size: 13px;
          color: var(--dusty-rose);
          text-decoration: none;
          display: flex;
          align-items: center;
          height: 46px;
        }

        .howSection,
        .templatesSection,
        .proofSection {
          padding: 100px 24px;
          background: transparent;
        }
        .sectionInner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .sectionLabel {
          font-size: 10px;
          font-weight: 600;
          color: var(--main-rose);
          text-align: center;
          margin-bottom: 12px;
        }
        .sectionTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 600;
          text-align: center;
          margin-bottom: 16px;
        }
        .sectionSub {
          font-size: 13px;
          color: var(--dusty-rose);
          text-align: center;
          margin-bottom: 48px;
        }

        .sliderWrapper {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 30px;
        }
        .sliderWrapper::-webkit-scrollbar {
          display: none;
        }

        .templatesGrid,
        .proofGrid {
          display: flex;
          gap: 20px;
          padding: 10px 4px 20px;
          width: max-content;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .templatesGrid,
          .proofGrid {
            margin: 0;
            padding: 10px 20px 20px;
          }
        }

        .stepCard,
        .proofCard {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 18px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .stepCard:hover,
        .proofCard:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(194, 24, 91, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }

        .templateCard {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 18px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          width: 220px;
          position: relative;
          overflow: hidden;
        }
        .templateCard.hovered {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(194, 24, 91, 0.1);
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .stepCard {
          padding: 28px 24px;
        }
        .stepNum {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          color: rgba(194, 24, 91, 0.15);
          margin-bottom: 14px;
          transition: 0.3s;
        }
        .stepCard:hover .stepNum {
          color: var(--main-rose);
          transform: scale(1.1);
        }
        .stepTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          margin-bottom: 10px;
        }
        .stepDesc {
          font-size: 13px;
          color: var(--dusty-rose);
          line-height: 1.6;
        }

        .templatePreview {
          height: 130px;
          background: var(--card-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .templateDot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--card-accent);
          opacity: 0.7;
        }
        .templateLine {
          height: 3px;
          border-radius: 999px;
          background: var(--card-accent);
          opacity: 0.2;
        }
        .templateLine.long {
          width: 40px;
        }
        .templateLine.medium {
          width: 30px;
        }
        .templateLine.short {
          width: 20px;
        }
        .templateInfo {
          padding: 14px 16px 14px;
        }
        .templateName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 700;
        }
        .templateMood {
          font-size: 10px;
          color: var(--dusty-rose);
        }

        .templateHoverOverlay {
          position: absolute;
          inset: 0;
          background: rgba(44, 26, 32, 0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .templateCard.hovered .templateHoverOverlay {
          opacity: 1;
          pointer-events: auto;
        }
        .templateHoverBtn {
          color: #fff;
          border: none;
          padding: 16px 32px;
          border-radius: 999px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translateY(12px);
          transition:
            transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            box-shadow 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          -webkit-appearance: none;
          letter-spacing: 0.02em;
        }
        .templateCard.hovered .templateHoverBtn {
          transform: translateY(0);
        }

        .proofCard {
          width: 240px;
          padding: 28px 24px;
          text-align: center;
        }
        .proofEmoji {
          font-size: 28px;
          margin-bottom: 12px;
        }
        .proofName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 700;
        }
        .proofOccasion {
          font-size: 11px;
          color: var(--main-rose);
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .proofViews {
          font-size: 11px;
          color: var(--dusty-rose);
        }

        .testimonial {
          max-width: 680px;
          margin: 48px auto 0;
          text-align: center;
          border-top: 1px solid rgba(194, 24, 91, 0.08);
          padding-top: 48px;
        }
        .quoteMarks {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          color: var(--main-rose);
          opacity: 0.4;
          line-height: 0;
        }
        .quoteText {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 32px);
          font-style: italic;
          margin-bottom: 20px;
        }
        .quoteAuthor {
          font-size: 12px;
          color: var(--dusty-rose);
          font-weight: 500;
        }

        .ctaSection {
          padding: 60px 24px 100px;
        }
        .ctaInner {
          max-width: 800px;
          margin: 0 auto;
          background: var(--rose-dark);
          padding: 48px 60px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          box-shadow: 0 20px 50px rgba(122, 23, 51, 0.2);
        }
        .ctaTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #fff;
          line-height: 1.1;
          margin: 0;
        }
        .ctaTitle em {
          font-style: italic;
          color: var(--rose-blush);
        }
        .ctaBigBtn {
          padding: 16px 32px;
          background: #fff;
          color: var(--rose-dark);
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: 0.3s;
        }
        .ctaBigBtn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        }

        .footer {
          background: var(--dark-plum);
          padding: 60px 24px 24px;
          color: rgba(255, 255, 255, 0.6);
        }
        .footerInner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 60px;
          flex-wrap: wrap;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 40px;
        }
        .footerLogo {
          margin-bottom: 10px;
        }
        .logoFooter {
          height: 28px;
          width: auto;
          object-fit: contain;
          opacity: 0.9;
        }
        .footerTagline {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
        }
        .footerCols {
          display: flex;
          gap: 48px;
        }
        .footerCol {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footerColTitle {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }
        .footerCol a {
          font-size: 12px;
          color: inherit;
          text-decoration: none;
        }
        .footerBottom {
          max-width: 1100px;
          margin: 24px auto 0;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .ctaInner {
            flex-direction: column;
            text-align: center;
            padding: 32px 24px;
            gap: 24px;
            max-width: 340px;
          }
          .ctaTitle {
            font-size: 26px;
          }
          .ctaBigBtn {
            width: 100%;
            text-align: center;
          }
          .heroCtas {
            flex-direction: column;
            width: 100%;
            max-width: 240px;
            margin: 0 auto;
          }
          .ctaPrimary,
          .ctaGhost {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  )
}
