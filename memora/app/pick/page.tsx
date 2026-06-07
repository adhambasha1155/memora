'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Playful birthday preview pages (4 pages, gift opens gallery inline) ────────
// Static page definitions (no JSX — generated inside component to allow state)
const invitationBg =
  'linear-gradient(135deg,#fefccf 0%,#fadadd 60%,#ffdf84 100%)'
const journeyBg = 'linear-gradient(135deg,#fefccf 0%,#fadadd 100%)'
const giftBg = 'linear-gradient(135deg,#fefccf 0%,#fadadd 50%,#ffdf84 100%)'
const wishesBg = 'linear-gradient(135deg,#fefccf 0%,#e1e1f5 50%,#fadadd 100%)'
const galleryBg = 'linear-gradient(135deg,#fefccf 0%,#fadadd 40%,#ffdf84 100%)'

const PREVIEW_PAGES = ['invitation', 'journey', 'gift', 'wishes'] as const
type PreviewPage = (typeof PREVIEW_PAGES)[number]

function PlayfulPreview() {
  const [current, setCurrent] = useState<PreviewPage>('invitation')
  const [visible, setVisible] = useState(true)
  const [giftOpened, setGiftOpened] = useState(false)
  const [gallerySlide, setGallerySlide] = useState(0)

  const rotations = [-9, 8, -5, 12]
  const shifts = [0, -28, 31, -48]
  const photos = ['📸', '🌟', '🎂', '✨']

  useEffect(() => {
    const sequence = [
      // [page, giftOpened, gallerySlide, duration]
      ['invitation', false, 0, 2600],
      ['journey', false, 0, 2600],
      ['gift', false, 0, 1200], // show closed gift box
      ['gift', true, 0, 1200], // auto-open → gallery slide 0
      ['gift', true, 1, 1200], // gallery slide 1
      ['gift', true, 2, 1200], // gallery slide 2
      ['wishes', false, 0, 2600],
    ] as const

    let step = 0

    function runStep() {
      const [page, opened, slide, duration] = sequence[step]
      setVisible(false)
      setTimeout(() => {
        setCurrent(page as PreviewPage)
        setGiftOpened(opened)
        setGallerySlide(slide)
        setVisible(true)
        step = (step + 1) % sequence.length
        timer = setTimeout(runStep, duration)
      }, 300)
    }

    let timer = setTimeout(runStep, sequence[0][3] as number)
    return () => clearTimeout(timer)
  }, [])

  function getBg() {
    if (current === 'invitation') return invitationBg
    if (current === 'journey') return journeyBg
    if (current === 'gift') return giftOpened ? galleryBg : giftBg
    return wishesBg
  }

  function getLabel() {
    if (current === 'gift' && giftOpened) return 'Gallery'
    const map: Record<PreviewPage, string> = {
      invitation: 'Invitation',
      journey: 'Our Story',
      gift: 'Gift Box',
      wishes: 'Wishes',
    }
    return map[current]
  }

  function renderContent() {
    if (current === 'invitation')
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '16px 12px 52px',
            gap: 8,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: 16, color: '#e9c349' }}>✦</div>
          <div
            style={{
              fontFamily: 'Georgia,serif',
              fontSize: 13,
              fontWeight: 700,
              color: '#70585b',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Happy Birthday Aria!
          </div>
          <div
            style={{
              fontSize: 7,
              color: '#4f4445',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: 110,
            }}
          >
            A magical celebration filled with wonder and joy.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[
              { l: '12', s: 'Days', bg: '#fadadd', c: '#765e61' },
              { l: '08', s: 'Hrs', bg: '#e1e1f5', c: '#626374' },
              { l: '45', s: 'Min', bg: '#ffdf84', c: '#7a6100' },
            ].map((x) => (
              <div
                key={x.s}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: x.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Georgia,serif',
                      fontSize: 10,
                      fontWeight: 700,
                      color: x.c,
                    }}
                  >
                    {x.l}
                  </span>
                </div>
                <span
                  style={{ fontSize: 6, color: '#4f4445', fontWeight: 600 }}
                >
                  {x.s}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 6,
              padding: '5px 12px',
              borderRadius: 999,
              background: 'linear-gradient(to right,#70585b,#8b6e71)',
              color: '#fff',
              fontSize: 8,
              fontWeight: 600,
            }}
          >
            ✦ Enter the Magic
          </div>
        </div>
      )

    if (current === 'journey')
      return (
        <div
          style={{
            padding: '40px 0 52px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            boxSizing: 'border-box',
            overflowY: 'hidden',
            position: 'relative',
          }}
        >
          {/* Title */}
          <div
            style={{ textAlign: 'center', marginBottom: 12, padding: '0 10px' }}
          >
            <div
              style={{
                fontFamily: 'Georgia,serif',
                fontSize: 12,
                fontWeight: 700,
                color: '#70585b',
              }}
            >
              Our Journey
            </div>
            <div style={{ fontSize: 7, color: '#4f4445', marginTop: 1 }}>
              Every magical moment
            </div>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            {/* Center line */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 1.5,
                background:
                  'linear-gradient(to bottom,transparent,#fadadd 10%,#fadadd 90%,transparent)',
                transform: 'translateX(-50%)',
                zIndex: 0,
              }}
            />

            {[
              {
                date: 'OCT 14, 2020',
                title: 'The Day We Met',
                dot: '#70585b',
                dotBg: '#fadadd',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6eceo1VcHfqcrd5g23IiJWvFqLA3dDWTWFNG_o1bWPJ7zlWVj6jm1Q0m1dfw81ECs112AXXQGJkOu7FsJwBIxYRm_03qONp-V55JDSF-qO-SxGNknxMHzV_WbHyRbXUWtG-sfHewDUcKjfVE0-uLPdo_dF1PQLgdJ04x6E7fBJTg-1k2ngui9SZbasci-W8ItcRyC-jvjZbpOpfJP5oedUzQvY1qRVN0boAO7k83MF0EzOFCed6EPB0fR6qQzHoGYO9Z_cBWtHw',
                rot: '-3deg',
                reverse: false,
              },
              {
                date: 'JUL 3, 2021',
                title: 'First Adventure',
                dot: '#735c00',
                dotBg: '#ffdf84',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbTRAuZOiMSYE5RGwKjG7EI6C8I6cXcxU_w-N7FN7mcSKHHzX6m74Tl-Lth6E3KOhM8tq7b3j_iO5p2WkvOiOiH3AfUCTpuPJ0mX5qpXqNq9hJsSPu5lmbMWbdPSPiWtQ3ZHIUxdriD8xCayjCF-kW41H-PDhjzODC4Metu7bjd_b23nLvfNE1oqjCnHkpxlEsz-dh9OvJS8X3iXrUlkt9RlWUpmGG-7-7IgsNzRg9YIB1XXTFFaOOt8kPt7bRKby-B99COx-rx2I',
                rot: '2deg',
                reverse: true,
              },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 16px 1fr',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 12,
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!m.reverse ? (
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.88)',
                        borderRadius: 6,
                        padding: '4px 6px',
                        boxShadow: '0 2px 6px rgba(112,88,91,0.1)',
                      }}
                    >
                      <div
                        style={{ fontSize: 6, color: m.dot, fontWeight: 700 }}
                      >
                        {m.date}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Georgia,serif',
                          fontSize: 8,
                          fontWeight: 700,
                          color: '#1d1d03',
                          lineHeight: 1.2,
                        }}
                      >
                        {m.title}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 54,
                        borderRadius: 7,
                        overflow: 'hidden',
                        transform: `rotate(${m.rot})`,
                        boxShadow: '0 4px 10px rgba(112,88,91,0.2)',
                      }}
                    >
                      <img
                        src={m.img}
                        alt={m.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: m.dotBg,
                      border: `2px solid ${m.dot}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: m.dot,
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {m.reverse ? (
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.88)',
                        borderRadius: 6,
                        padding: '4px 6px',
                        boxShadow: '0 2px 6px rgba(112,88,91,0.1)',
                      }}
                    >
                      <div
                        style={{ fontSize: 6, color: m.dot, fontWeight: 700 }}
                      >
                        {m.date}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Georgia,serif',
                          fontSize: 8,
                          fontWeight: 700,
                          color: '#1d1d03',
                          lineHeight: 1.2,
                        }}
                      >
                        {m.title}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 54,
                        borderRadius: 7,
                        overflow: 'hidden',
                        transform: `rotate(${m.rot})`,
                        boxShadow: '0 4px 10px rgba(112,88,91,0.2)',
                      }}
                    >
                      <img
                        src={m.img}
                        alt={m.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    if (current === 'gift' && !giftOpened)
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 8,
            padding: '12px 12px 52px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia,serif',
              fontSize: 12,
              fontWeight: 700,
              color: '#70585b',
            }}
          >
            A Surprise For You
          </div>
          <div style={{ fontSize: 7, color: '#4f4445' }}>
            Tap the box to reveal!
          </div>
          <div
            style={{
              position: 'relative',
              width: 64,
              height: 64,
              marginTop: 4,
              cursor: 'pointer',
            }}
            onClick={() => setGiftOpened(true)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#fadadd',
                borderRadius: 12,
                filter: 'blur(10px)',
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 6,
                background: 'rgba(255,255,255,0.8)',
                borderRadius: 10,
                border: '1.5px solid rgba(255,224,136,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 10,
                  background: 'rgba(255,224,136,0.85)',
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: 10,
                  background: 'rgba(255,224,136,0.85)',
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#735c00',
                  border: '2px solid #ffe088',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  color: '#ffe088',
                }}
              >
                ✦
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.65)',
              fontSize: 7,
              color: '#4f4445',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => setGiftOpened(true)}
          >
            👆 Tap to open
          </div>
        </div>
      )

    if (current === 'gift' && giftOpened)
      return (
        <div
          style={{
            padding: '10px 10px 52px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia,serif',
              fontSize: 11,
              fontWeight: 700,
              color: '#70585b',
            }}
          >
            Moments of Magic 🎁
          </div>
          <div style={{ fontSize: 7, color: '#4f4445' }}>
            A little collection of smiles
          </div>
          {/* Mini stacked cards */}
          <div
            style={{
              position: 'relative',
              width: 110,
              height: 90,
              marginTop: 4,
            }}
          >
            {photos.map((_, i) => {
              const depth = (i - gallerySlide + photos.length) % photos.length
              const rot = rotations[i % rotations.length]
              const x = shifts[i % shifts.length]
              const isActive = depth === 0
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 4,
                    width: 100,
                    height: 80,
                    background: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                    borderRadius: 5,
                    zIndex: 100 - depth,
                    opacity: isActive ? 1 : Math.max(0.3, 0.7 - depth * 0.15),
                    transform: isActive
                      ? 'translateX(-50%) scale(1) rotate(0deg)'
                      : `translateX(calc(-50% + ${x * 0.4}px)) translateY(${depth * 10}px) scale(${1 - depth * 0.06}) rotate(${rot}deg)`,
                    transition: 'all 0.4s ease',
                    boxShadow: '0 4px 12px rgba(112,88,91,0.15)',
                    padding: '4px 4px 14px',
                    border: '1px solid rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {photos[i]}
                </div>
              )
            })}
          </div>
          <div
            style={{
              marginTop: 6,
              padding: '5px 12px',
              borderRadius: 999,
              background: 'linear-gradient(to right,#70585b,#8b6e71)',
              color: '#fff',
              fontSize: 7,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => setGallerySlide((s) => (s + 1) % photos.length)}
          >
            Next →
          </div>
        </div>
      )

    // wishes
    return (
      <div
        style={{
          padding: '12px 10px 52px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#e9c349' }}>✦</div>
          <div
            style={{
              fontFamily: 'Georgia,serif',
              fontSize: 11,
              fontWeight: 700,
              color: '#70585b',
            }}
          >
            A Universe of Wishes
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.65)',
            borderRadius: 10,
            padding: '8px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia,serif',
              fontSize: 9,
              fontStyle: 'italic',
              color: '#70585b',
              marginBottom: 4,
            }}
          >
            Dearest Aria,
          </div>
          <div style={{ fontSize: 7, color: '#1d1d03', lineHeight: 1.6 }}>
            As you celebrate another beautiful trip around the sun, we wanted to
            gather all the love...
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: 'Georgia,serif',
              fontSize: 8,
              fontStyle: 'italic',
              color: '#765e61',
              textAlign: 'center',
              paddingTop: 4,
              borderTop: '1px solid rgba(112,88,91,0.1)',
            }}
          >
            &quot;May your day sparkle.&quot;
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.65)',
            borderRadius: 999,
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <span style={{ color: '#735c00', fontSize: 9 }}>★</span>
          <span
            style={{
              fontSize: 7,
              fontWeight: 600,
              color: '#4f4445',
              textTransform: 'uppercase',
            }}
          >
            Make a wish
          </span>
          <span style={{ color: '#735c00', fontSize: 9 }}>★</span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: getBg(),
        transition: 'background 0.3s ease',
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.28s ease,transform 0.28s ease',
        }}
      >
        {renderContent()}
      </div>
      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
          zIndex: 5,
        }}
      >
        {PREVIEW_PAGES.map((p, i) => (
          <div
            key={p}
            onClick={() => {
              setCurrent(p)
              setVisible(true)
              if (p !== 'gift') setGiftOpened(false)
            }}
            style={{
              width: current === p ? 14 : 4,
              height: 4,
              borderRadius: 999,
              background: current === p ? '#c2185b' : 'rgba(112,88,91,0.25)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      {/* Page label */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          fontSize: 9,
          fontWeight: 600,
          color: 'rgba(112,88,91,0.5)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 5,
        }}
      >
        {getLabel()}
      </div>
    </div>
  )
}

// ── Template data ────────────────────────────────────────────────────────────
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
    particles: ['—', '·', '○'],
    previewLines: ['#333', '#999', '#ddd'],
  },
]

export default function PickPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 900
  })
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="pickPage">
      <nav className={`pickNav ${scrolled ? 'scrolled' : ''}`}>
        <div className="pickNavInner">
          <Link href="/" className="dashBrand">
            <img src="/memora-logo.png" alt="Memora" className="logo" />
          </Link>
          <Link href="/dashboard" className="backBtn">
            ← Back to account
          </Link>
        </div>
      </nav>

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

      <div className="templatesList">
        {TEMPLATES.map((t, index) => (
          <div
            key={t.id}
            className={`templateRow ${hoveredId === t.id ? 'hovered' : ''} ${index % 2 === 1 ? 'reversed' : ''}`}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
            onTouchStart={() => setHoveredId(t.id)}
            onTouchEnd={() => setTimeout(() => setHoveredId(null), 2000)}
          >
            {/* Preview */}
            <div className="previewWrap">
              <div
                className="previewCard"
                style={{ background: t.bg }}
                onClick={() => router.push(`/create/${t.id}`)}
              >
                {/* Playful template → animated preview on hover (desktop) or always on mobile */}
                {t.id === 3 && (hoveredId === 3 || isMobile) ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg,#fefccf,#fadadd)',
                      borderRadius: 24,
                    }}
                  >
                    <PlayfulPreview />
                  </div>
                ) : (
                  <div className="previewInner">
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
                    <div className="previewMock">
                      <div
                        className="mockDot"
                        style={{ background: t.accent }}
                      />
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
                    <div
                      className="previewWatermark"
                      style={{ color: t.accent }}
                    >
                      {t.name}
                    </div>
                  </div>
                )}

                {/* Hover overlay — only for non-playful or playful when not showing phone */}
                {!(t.id === 3 && (hoveredId === 3 || isMobile)) && (
                  <div className="previewOverlay">
                    <button
                      className="useBtn"
                      style={{ background: t.accent }}
                      onClick={() => router.push(`/create/${t.id}`)}
                    >
                      Use this template →
                    </button>
                  </div>
                )}

                {/* Choose button overlay for playful when phone is showing */}
                {t.id === 3 && (hoveredId === 3 || isMobile) && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                    }}
                  >
                    <button
                      style={{
                        background: t.accent,
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 999,
                        fontSize: 13,
                        fontFamily: '"DM Sans",sans-serif',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => router.push(`/create/${t.id}`)}
                    >
                      Use this template →
                    </button>
                  </div>
                )}
              </div>
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
                onClick={() => router.push(`/create/${t.id}`)}
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
          height: 36px;
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
