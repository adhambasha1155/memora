'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import { SiteData, MediaItem } from '@/app/lib/getSiteBySlug'
import Loading from '@/app/loading'

export default function SlugGiftBoxPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [site, setSite] = useState<SiteData | null>(null)
  const [galleryPhotos, setGalleryPhotos] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: siteData } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!siteData || !siteData.is_published) {
        router.replace(`/s/${slug}/not-published`)
        return
      }

      const { data: media } = await supabase
        .from('media')
        .select('*')
        .eq('site_id', siteData.id)
        .eq('file_type', 'gallery_photo')
        .order('order_index', { ascending: true })

      setSite(siteData as SiteData)
      setGalleryPhotos((media || []) as MediaItem[])
      setLoading(false)
    }
    load()
  }, [slug])

  function openGift() {
    setGlowing(true)
    setTimeout(() => {
      setOpened(true)
      setGlowing(false)
    }, 700)
  }

  if (loading) return <Loading />

  const s = site!
  const bg = s.bg_color || '#fadadd'
  const text = s.text_color || '#70585b'
  const accent = s.accent_color || '#70585b'
  const subtitle =
    s.gift_subtitle || 'Tap the magical box to reveal your birthday surprise!'
  const revealMessage =
    s.gift_message || 'A little something made with a whole lot of love 💝'

  const currentPhoto = galleryPhotos[currentSlide]
  const hasPhotos = galleryPhotos.length > 0

  return (
    <>
      <style>{`
        @keyframes glowBurst {
          0% { opacity: 0; transform: scale(0.65); }
          35% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.55); }
        }
        .glow-burst {
          position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: 0;
          background: radial-gradient(circle at center, rgba(255,224,136,0.95), rgba(251,219,222,0.72) 35%, transparent 70%);
        }
        .glow-burst.show { animation: glowBurst 0.7s ease forwards; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .slide-in { animation: slideIn 0.45s ease both; }
      `}</style>

      <div
        className="min-h-screen flex flex-col relative overflow-x-hidden"
        style={{ background: bg, color: text, paddingBottom: 110 }}
      >
        {/* Glow burst */}
        <div className={`glow-burst ${glowing ? 'show' : ''}`} />

        {/* Background decorations */}
        <div
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full"
          style={{ background: bg, filter: 'blur(32px)', opacity: 0.6 }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full"
          style={{ background: '#ffdf84', filter: 'blur(32px)', opacity: 0.5 }}
        />
        <span
          className="material-symbols-outlined absolute top-40 right-20 opacity-40 rotate-12"
          style={{ color: '#e9c349', fontSize: 36 }}
        >
          star
        </span>
        <span
          className="material-symbols-outlined absolute bottom-40 left-20 opacity-40 -rotate-12"
          style={{ color: accent, fontSize: 44 }}
        >
          favorite
        </span>

        {/* Top bar */}
        <header
          className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2"
          style={{
            background: `${bg}cc`,
            boxShadow: '0 20px 50px rgba(112,88,91,0.15)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined"
              style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 24,
                fontWeight: 600,
                color: text,
              }}
            >
              {s.recipient_name
                ? `${s.recipient_name}'s ${s.occasion || 'Day'}`
                : 'A Surprise'}
            </span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-32 px-6 md:px-20 relative z-10">
          {!opened ? (
            /* Closed gift box state */
            <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
              <div className="text-center mb-12">
                <h1
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 'clamp(32px,8vw,48px)',
                    fontWeight: 700,
                    color: text,
                    marginBottom: 16,
                  }}
                >
                  A Surprise For You
                </h1>
                <p
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: 18,
                    color: text,
                    lineHeight: 1.6,
                    maxWidth: 384,
                    margin: '0 auto',
                    opacity: 0.8,
                  }}
                >
                  {subtitle}
                </p>
              </div>

              {/* Gift box */}
              <div
                className="relative w-64 h-64 cursor-pointer hover:scale-105 transition-transform duration-300 group z-20"
                onClick={openGift}
              >
                <div
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: accent }}
                />
                <div
                  className="absolute inset-4 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.65)',
                    backdropFilter: 'blur(12px)',
                    border: `2px solid ${accent}44`,
                    boxShadow: '0 8px 32px rgba(112,88,91,0.15)',
                  }}
                >
                  <div
                    className="absolute inset-y-0 w-8 left-1/2 -translate-x-1/2 rounded-sm"
                    style={{ background: `${accent}cc` }}
                  />
                  <div
                    className="absolute inset-x-0 h-8 top-1/2 -translate-y-1/2 rounded-sm"
                    style={{ background: `${accent}cc` }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 z-10 flex items-center justify-center"
                    style={{ background: accent, borderColor: '#ffe088' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: '#fff', fontSize: 16 }}
                    >
                      magic_button
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-10 px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
                onClick={openGift}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: text, fontSize: 18 }}
                >
                  touch_app
                </span>
                <span
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    color: text,
                  }}
                >
                  Tap to open
                </span>
              </div>
            </div>
          ) : (
            /* Opened — gallery state */
            <div className="w-full max-w-2xl mx-auto slide-in">
              <div className="text-center mb-8">
                <h1
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 'clamp(28px,6vw,40px)',
                    fontWeight: 700,
                    color: text,
                    marginBottom: 12,
                  }}
                >
                  🎁 Your Surprise!
                </h1>
                <p
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: 16,
                    color: text,
                    opacity: 0.75,
                    lineHeight: 1.6,
                  }}
                >
                  {revealMessage}
                </p>
              </div>

              {hasPhotos ? (
                <>
                  {/* Main photo */}
                  <div
                    className="relative rounded-3xl overflow-hidden mb-6"
                    style={{
                      aspectRatio: '4/3',
                      boxShadow: '0 24px 60px rgba(112,88,91,0.2)',
                    }}
                  >
                    <img
                      src={currentPhoto.file_url}
                      alt={currentPhoto.title || `Photo ${currentSlide + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {(currentPhoto.title || currentPhoto.caption) && (
                      <div
                        className="absolute bottom-0 left-0 right-0 p-6"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        }}
                      >
                        {currentPhoto.title && (
                          <h3
                            style={{
                              fontFamily: '"Playfair Display", serif',
                              fontSize: 22,
                              fontWeight: 600,
                              color: '#fff',
                              marginBottom: 4,
                            }}
                          >
                            {currentPhoto.title}
                          </h3>
                        )}
                        {currentPhoto.caption && (
                          <p
                            style={{
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontSize: 14,
                              color: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            {currentPhoto.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (c) =>
                            (c - 1 + galleryPhotos.length) %
                            galleryPhotos.length
                        )
                      }
                      className="w-12 h-12 rounded-full flex items-center justify-center border border-white/50 hover:scale-110 transition-transform"
                      style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(8px)',
                        color: text,
                      }}
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>
                    <span
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: 13,
                        color: text,
                        opacity: 0.6,
                      }}
                    >
                      {currentSlide + 1} / {galleryPhotos.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentSlide((c) => (c + 1) % galleryPhotos.length)
                      }
                      className="w-12 h-12 rounded-full flex items-center justify-center border border-white/50 hover:scale-110 transition-transform"
                      style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(8px)',
                        color: text,
                      }}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>

                  {/* Dot indicators */}
                  {galleryPhotos.length > 1 && (
                    <div className="flex justify-center gap-2">
                      {galleryPhotos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className="rounded-full transition-all"
                          style={{
                            width: i === currentSlide ? 20 : 8,
                            height: 8,
                            background:
                              i === currentSlide ? accent : `${accent}44`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="text-center py-16 rounded-3xl"
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="text-4xl mb-4">✨</div>
                  <p
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: 20,
                      color: text,
                    }}
                  >
                    The magic is all in the message
                  </p>
                </div>
              )}

              {/* Back button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setOpened(false)
                    setCurrentSlide(0)
                  }}
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: 13,
                    color: text,
                    opacity: 0.5,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  ← Close gift
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
