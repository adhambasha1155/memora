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
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navInner">
          <span className="navBrand">Memora</span>
          <div className="navActions">
            {user ? (
              <Link href="/dashboard" className="btnPrimary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btnGhost">
                  Sign in
                </Link>
                <Link href="/signup" className="btnPrimary">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
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
            Create cinematic, interactive websites for the moments that matter —
            <br />
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

        <div className="heroCard">
          <div className="heroCardInner">
            <div className="heroCardDate">MAY 2026 · ALEXANDRIA</div>
            <div className="heroCardTitle">Happy Birthday, Sina 💖</div>
            <div className="heroCardMsg">
              I only want to see you as the best person in the whole world...
            </div>
            <div className="heroCardFooter">
              <div className="heroCardAvatar">A</div>
              <span className="heroCardViews">♥ 847 views</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
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

      {/* Templates */}
      <section className="templatesSection" id="templates">
        <div className="sectionInner">
          <div className="sectionLabel">TEMPLATES</div>
          <h2 className="sectionTitle">Five ways to tell your story</h2>
          <p className="sectionSub">
            Each template is a complete cinematic experience. Pick the one that
            feels right.
          </p>
          <div className="templatesGrid">
            {templates.map((t) => (
              <div
                key={t.id}
                className="templateCard"
                style={
                  {
                    '--card-bg': t.color,
                    '--card-accent': t.accent,
                  } as React.CSSProperties
                }
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
                <div className="templateActions">
                  <button className="templateBtn ghost">Preview</button>
                  <Link href="/signup" className="templateBtn primary">
                    Use this
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="proofSection">
        <div className="sectionInner">
          <div className="sectionLabel">MADE WITH MEMORA</div>
          <h2 className="sectionTitle">Real moments, real people</h2>
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

          <div className="testimonial">
            <div className="quoteMarks">"</div>
            <p className="quoteText">
              Memora turned a folder of photos into something I actually look at
              every single day.
            </p>
            <div className="quoteAuthor">
              Nour Khalil · Designer, Alexandria
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ctaSection">
        <div className="ctaInner">
          <h2 className="ctaTitle">
            Start crafting your
            <br />
            <em>memories today.</em>
          </h2>
          <Link href="/signup" className="ctaBigBtn">
            Create your first Memora →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerLogo">Memora</div>
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
          --rose-mid: #e8809e;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background: var(--warm-white);
          overflow-x: hidden;
        }

        /* NAVBAR */
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
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--main-rose);
          letter-spacing: 0.02em;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btnGhost {
          padding: 8px 18px;
          border: 1px solid rgba(194, 24, 91, 0.2);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: var(--main-rose);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: 0.2s ease;
          background: transparent;
        }

        .btnGhost:hover {
          background: var(--rose-blush);
        }

        .btnPrimary {
          padding: 8px 18px;
          border: none;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          background: var(--main-rose);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: 0.2s ease;
          box-shadow: 0 4px 14px rgba(194, 24, 91, 0.25);
        }

        .btnPrimary:hover {
          background: var(--rose-dark);
          transform: translateY(-1px);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          padding: 120px 24px 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          position: relative;
          overflow: hidden;
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
          max-width: 100%;
          box-sizing: border-box;
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
          flex: 1;
          max-width: 560px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.8s ease forwards;
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(194, 24, 91, 0.08);
          border: 1px solid rgba(194, 24, 91, 0.15);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          color: var(--main-rose);
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }

        .heroTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.05;
          color: var(--dark-plum);
          letter-spacing: -0.02em;
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
          font-weight: 300;
          margin-bottom: 32px;
        }

        .heroCtas {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ctaPrimary {
          padding: 14px 28px;
          background: var(--main-rose);
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: 0.2s ease;
          box-shadow: 0 8px 24px rgba(194, 24, 91, 0.25);
        }

        .ctaPrimary:hover {
          background: var(--rose-dark);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(194, 24, 91, 0.3);
        }

        .ctaGhost {
          padding: 14px 24px;
          color: var(--dusty-rose);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: 0.2s ease;
          border: 1px solid rgba(138, 100, 112, 0.2);
          border-radius: 999px;
        }

        .ctaGhost:hover {
          color: var(--main-rose);
          border-color: rgba(194, 24, 91, 0.3);
          background: var(--rose-blush);
        }

        .heroCard {
          flex: 0 0 320px;
          animation: fadeUp 0.8s 0.2s ease both;
          position: relative;
          z-index: 1;
        }

        .heroCardInner {
          background: #fff;
          border: 1px solid rgba(194, 24, 91, 0.1);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 24px 60px rgba(194, 24, 91, 0.12);
        }

        .heroCardDate {
          font-size: 10px;
          color: var(--dusty-rose);
          letter-spacing: 0.08em;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .heroCardTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .heroCardMsg {
          font-size: 12px;
          color: var(--dusty-rose);
          line-height: 1.6;
          margin-bottom: 18px;
          font-style: italic;
        }

        .heroCardFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .heroCardAvatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--main-rose);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .heroCardViews {
          font-size: 11px;
          color: var(--rose-mid);
          font-weight: 500;
        }

        /* HOW IT WORKS */
        .howSection {
          padding: 100px 24px;
          background: #fff;
        }

        .sectionInner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sectionLabel {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--main-rose);
          margin-bottom: 12px;
        }

        .sectionTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 600;
          color: var(--dark-plum);
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .sectionSub {
          font-size: 13px;
          color: var(--dusty-rose);
          font-weight: 300;
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .stepCard {
          padding: 28px 24px;
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 18px;
          background: var(--warm-white);
          transition: 0.25s ease;
        }

        .stepCard:hover {
          border-color: rgba(194, 24, 91, 0.2);
          box-shadow: 0 12px 32px rgba(194, 24, 91, 0.08);
          transform: translateY(-3px);
        }

        .stepNum {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 700;
          color: rgba(194, 24, 91, 0.15);
          line-height: 1;
          margin-bottom: 14px;
        }

        .stepTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--dark-plum);
          margin-bottom: 10px;
        }

        .stepDesc {
          font-size: 13px;
          color: var(--dusty-rose);
          line-height: 1.65;
          font-weight: 300;
        }

        /* TEMPLATES */
        .templatesSection {
          padding: 100px 24px;
          background: var(--warm-white);
        }

        .templatesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 18px;
          margin-top: 48px;
        }

        .templateCard {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(194, 24, 91, 0.1);
          background: #fff;
          transition: 0.25s ease;
          cursor: pointer;
        }

        .templateCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(194, 24, 91, 0.12);
          border-color: rgba(194, 24, 91, 0.25);
        }

        .templatePreview {
          height: 130px;
          background: var(--card-bg, #f5f5f5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px;
        }

        .templateDot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--card-accent, #c2185b);
          opacity: 0.7;
        }

        .templateLines {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }

        .templateLine {
          height: 3px;
          border-radius: 999px;
          background: var(--card-accent, #c2185b);
          opacity: 0.2;
        }

        .templateLine.long {
          width: 100%;
        }
        .templateLine.medium {
          width: 70%;
        }
        .templateLine.short {
          width: 45%;
        }

        .templateInfo {
          padding: 14px 16px 10px;
        }

        .templateName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 3px;
        }

        .templateMood {
          font-size: 10px;
          color: var(--dusty-rose);
          font-weight: 400;
        }

        .templateActions {
          padding: 0 16px 14px;
          display: flex;
          gap: 8px;
        }

        .templateBtn {
          flex: 1;
          height: 30px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
          border: none;
        }

        .templateBtn.ghost {
          background: var(--rose-blush);
          color: var(--main-rose);
        }

        .templateBtn.ghost:hover {
          background: rgba(194, 24, 91, 0.15);
        }

        .templateBtn.primary {
          background: var(--main-rose);
          color: #fff;
        }

        .templateBtn.primary:hover {
          background: var(--rose-dark);
        }

        /* SOCIAL PROOF */
        .proofSection {
          padding: 100px 24px;
          background: #fff;
        }

        .proofGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 48px;
          margin-bottom: 64px;
        }

        .proofCard {
          padding: 28px 24px;
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 18px;
          background: var(--warm-white);
          text-align: center;
          transition: 0.25s ease;
        }

        .proofCard:hover {
          border-color: rgba(194, 24, 91, 0.2);
          box-shadow: 0 12px 32px rgba(194, 24, 91, 0.08);
          transform: translateY(-3px);
        }

        .proofEmoji {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .proofName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 5px;
        }

        .proofOccasion {
          font-size: 11px;
          color: var(--main-rose);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .proofViews {
          font-size: 11px;
          color: var(--dusty-rose);
          font-weight: 400;
        }

        .testimonial {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          padding: 48px 0;
          border-top: 1px solid rgba(194, 24, 91, 0.08);
        }

        .quoteMarks {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          color: var(--main-rose);
          line-height: 0.5;
          margin-bottom: 24px;
          opacity: 0.4;
        }

        .quoteText {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 400;
          color: var(--dark-plum);
          line-height: 1.4;
          margin-bottom: 20px;
          font-style: italic;
        }

        .quoteAuthor {
          font-size: 12px;
          color: var(--dusty-rose);
          font-weight: 500;
        }

        /* CTA SECTION */
        .ctaSection {
          background: var(--rose-dark);
          padding: 100px 24px;
        }

        .ctaInner {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .ctaTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 600;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
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
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .ctaBigBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        /* FOOTER */
        .footer {
          background: var(--dark-plum);
          padding: 60px 24px 24px;
        }

        .footerInner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 24px;
        }

        .footerBrand {
          flex: 1;
          min-width: 200px;
        }

        .footerLogo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
        }

        .footerTagline {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          font-weight: 300;
        }

        .footerCols {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }

        .footerCol {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 100px;
        }

        .footerColTitle {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 4px;
        }

        .footerCol a {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          font-weight: 300;
          transition: 0.2s ease;
        }

        .footerCol a:hover {
          color: #fff;
        }

        .footerBottom {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.25);
          flex-wrap: wrap;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            padding: 100px 20px 60px;
            text-align: center;
          }

          .heroCtas {
            justify-content: center;
          }

          .heroCard {
            flex: none;
            width: 100%;
            max-width: 340px;
          }

          .ctaInner {
            flex-direction: column;
            text-align: center;
          }

          .footerInner {
            flex-direction: column;
            gap: 32px;
          }
        }

        @media (max-width: 480px) {
          .templatesGrid {
            grid-template-columns: 1fr 1fr;
          }

          .navActions .btnGhost {
            display: none;
          }
        }
      `}</style>
    </main>
  )
}
