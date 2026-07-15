'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import { SiteData, MediaItem } from '@/app/lib/getSiteBySlug'
import Loading from '@/app/loading'

// ── Moved outside component so it's not recreated on every render ──
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">📸</div>
      <p
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 24,
          fontWeight: 600,
          color: text,
          marginBottom: 8,
        }}
      >
        No journey photos yet
      </p>
      <p
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 15,
          color: text,
          opacity: 0.6,
        }}
      >
        The creator hasn&apos;t added any milestone photos.
      </p>
    </div>
  )
}

export default function SlugJourneyPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [site, setSite] = useState<SiteData | null>(null)
  const [journeyPhotos, setJourneyPhotos] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredImg, setHoveredImg] = useState<number | null>(null)

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
        .eq('file_type', 'journey_photo')
        .order('order_index', { ascending: true })

      setSite(siteData as SiteData)
      setJourneyPhotos((media || []) as MediaItem[])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <Loading />

  const s = site!
  const bg = s.bg_color || '#fadadd'
  const text = s.text_color || '#70585b'
  const accent = s.accent_color || '#70585b'

  const dotColors = [
    { bg: '#fadadd', border: '#70585b', icon: 'favorite' },
    { bg: '#ffdf84', border: '#735c00', icon: 'flight_takeoff' },
    { bg: '#e1e1f5', border: '#5c5d6e', icon: 'auto_awesome' },
    { bg: '#fadadd', border: '#70585b', icon: 'star' },
    { bg: '#ffdf84', border: '#735c00', icon: 'celebration' },
  ]

  const rotations = ['2deg', '-2deg', '1deg', '-3deg', '2.5deg']

  return (
    <div
      className="min-h-screen relative overflow-x-hidden pt-24 pb-32"
      style={{ background: bg, paddingBottom: 110, color: text }}
    >
      {/* Background blobs */}
      <div
        className="absolute rounded-full"
        style={{
          background: bg,
          width: '40vw',
          height: '40vw',
          top: '10%',
          left: '-10%',
          filter: 'blur(40px)',
          opacity: 0.5,
          zIndex: -1,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          background: '#ffdf84',
          width: '30vw',
          height: '30vw',
          top: '40%',
          right: '-5%',
          filter: 'blur(40px)',
          opacity: 0.4,
          zIndex: -1,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          background: '#e1e1f5',
          width: '50vw',
          height: '50vw',
          bottom: '-10%',
          left: '20%',
          filter: 'blur(40px)',
          opacity: 0.4,
          zIndex: -1,
        }}
      />

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
              : 'Our Journey'}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(36px,8vw,48px)',
              fontWeight: 700,
              color: text,
              marginBottom: 16,
            }}
          >
            Our Journey
          </h2>
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 18,
              color: text,
              lineHeight: 1.6,
              opacity: 0.75,
            }}
          >
            Every magical moment that brought us to today.
          </p>
        </div>

        {journeyPhotos.length === 0 ? (
          <EmptyState text={text} />
        ) : (
          <div className="relative">
            {/* Timeline line desktop */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] z-0"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accent}55 10%, ${accent}55 90%, transparent)`,
                transform: 'translateX(-50%)',
              }}
            />
            {/* Timeline line mobile */}
            <div
              className="md:hidden absolute top-0 bottom-0 w-[2px] z-0"
              style={{
                left: 24,
                background: `linear-gradient(to bottom, transparent, ${accent}55 10%, ${accent}55 90%, transparent)`,
              }}
            />

            {journeyPhotos.map((photo, i) => {
              const isReverse = i % 2 === 1
              const dotStyle = dotColors[i % dotColors.length]
              const rotate = rotations[i % rotations.length]

              return (
                <div
                  key={photo.id}
                  className={`flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center w-full mb-24 relative`}
                >
                  {/* Text Card */}
                  <div
                    className={`w-full md:w-1/2 flex z-10 pl-16 md:pl-0 ${isReverse ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-12'}`}
                  >
                    <div
                      className="p-6 rounded-3xl border border-white/30 w-full max-w-sm relative overflow-hidden"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(12px)',
                        boxShadow:
                          hoveredCard === i
                            ? '0 32px 64px rgba(112,88,91,0.22)'
                            : '0 20px 50px rgba(112,88,91,0.12)',
                        transform:
                          hoveredCard === i ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {photo.date && (
                        <span
                          className="block mb-2 uppercase tracking-widest"
                          style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: 13,
                            fontWeight: 600,
                            color: dotStyle.border,
                          }}
                        >
                          {new Date(photo.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {photo.title && (
                        <h3
                          style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 28,
                            fontWeight: 600,
                            color: text,
                            marginBottom: 10,
                          }}
                        >
                          {photo.title}
                        </h3>
                      )}
                      {photo.caption && (
                        <p
                          style={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: 15,
                            color: text,
                            lineHeight: 1.6,
                            opacity: 0.8,
                          }}
                        >
                          {photo.caption}
                        </p>
                      )}
                      {!photo.title && !photo.caption && (
                        <p
                          style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 18,
                            color: text,
                            opacity: 0.5,
                            fontStyle: 'italic',
                          }}
                        >
                          A beautiful moment
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dot */}
                  <div
                    className="absolute left-6 md:left-1/2 top-6 md:top-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 z-20"
                    style={{
                      background: dotStyle.bg,
                      borderColor: bg,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: dotStyle.border, fontSize: 20 }}
                    >
                      {dotStyle.icon}
                    </span>
                  </div>

                  {/* Photo */}
                  <div
                    className={`w-full md:w-1/2 z-10 pt-6 md:pt-0 pl-16 md:pl-0 ${isReverse ? 'md:pr-12' : 'md:pl-12'}`}
                  >
                    <div
                      className="w-full max-w-sm h-64 rounded-3xl overflow-hidden border border-white/20"
                      style={{
                        boxShadow:
                          hoveredImg === i
                            ? '0 32px 64px rgba(112,88,91,0.25)'
                            : '0 20px 50px rgba(112,88,91,0.15)',
                        transform:
                          hoveredImg === i
                            ? 'scale(1.07) rotate(0deg)'
                            : `rotate(${rotate})`,
                        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                      }}
                      onMouseEnter={() => setHoveredImg(i)}
                      onMouseLeave={() => setHoveredImg(null)}
                    >
                      <img
                        src={photo.file_url}
                        alt={photo.title || `Memory ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
