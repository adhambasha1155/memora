'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import { SiteData } from '@/app/lib/getSiteBySlug'
import Loading from '@/app/loading'

interface CountdownValues {
  days: number
  hours: number
  mins: number
  secs: number
}

function getCountdown(targetDateStr: string | null): CountdownValues {
  if (!targetDateStr) return { days: 0, hours: 0, mins: 0, secs: 0 }
  const target = new Date(targetDateStr).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, mins, secs }
}

export default function SlugInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [site, setSite] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!data || !data.is_published) {
        router.replace(`/s/${slug}/not-published`)
        return
      }
      setSite(data as SiteData)
      setLoading(false)
    }
    load()
  }, [slug])

  // Countdown timer
  useEffect(() => {
    if (!site?.date) return
    const update = () => setCountdown(getCountdown(site.date))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [site?.date])

  if (loading) return <Loading />

  const s = site!
  const bg = s.bg_color || '#fadadd'
  const text = s.text_color || '#70585b'
  const accent = s.accent_color || '#70585b'
  const heading =
    s.invite_heading ||
    `Happy ${s.occasion || 'Birthday'}, ${s.recipient_name || ''}!`
  const subtitle =
    s.invite_subtitle ||
    'Join us for a magical celebration filled with wonder, joy, and sparkling surprises.'
  const countdownLabel = s.invite_countdown_label || 'The Magic Begins In...'
  const buttonText = s.invite_button_text || 'Enter the Magic'

  const pad = (n: number) => String(n).padStart(2, '0')

  const countdownItems = [
    { label: 'Days', value: pad(countdown.days), bg: `${bg}dd`, color: text },
    {
      label: 'Hours',
      value: pad(countdown.hours),
      bg: '#e1e1f5',
      color: '#626374',
    },
    {
      label: 'Mins',
      value: pad(countdown.mins),
      bg: '#ffdf84',
      color: '#7a6100',
    },
    {
      label: 'Secs',
      value: pad(countdown.secs),
      bg: '#fadadd',
      color: '#765e61',
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
      style={{ background: bg, paddingBottom: 110, color: text }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full -top-20 -left-20"
          style={{ background: bg, filter: 'blur(40px)', opacity: 0.6 }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bottom-0 right-[-100px]"
          style={{ background: '#ffdf84', filter: 'blur(40px)', opacity: 0.4 }}
        />
        <div
          className="absolute w-72 h-72 rounded-full top-1/2 left-1/4"
          style={{ background: '#e1e1f5', filter: 'blur(40px)', opacity: 0.5 }}
        />
        <span
          className="material-symbols-outlined absolute top-1/4 right-1/4 text-4xl opacity-40 rotate-12"
          style={{ color: accent }}
        >
          star
        </span>
        <span
          className="material-symbols-outlined absolute top-1/3 left-10 text-5xl opacity-30 -rotate-12"
          style={{ color: accent }}
        >
          favorite
        </span>
        <span
          className="material-symbols-outlined absolute bottom-1/4 left-1/3 text-3xl opacity-50 rotate-45"
          style={{ color: '#e9c349' }}
        >
          auto_awesome
        </span>
        <span
          className="material-symbols-outlined absolute bottom-20 right-20 text-4xl opacity-40 -rotate-6"
          style={{ color: accent }}
        >
          favorite
        </span>
      </div>

      {/* Top bar */}
      <header
        className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2 transition-all hover:scale-105 duration-300"
        style={{
          background: `${bg}cc`,
          boxShadow: '0 20px 50px rgba(112,88,91,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: accent }}>
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
              : heading}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="pt-[120px] pb-32 px-6 md:px-20 min-h-screen flex flex-col items-center justify-center relative">
        <section className="text-center w-full max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
          {/* Title */}
          <div className="relative">
            <span
              className="material-symbols-outlined absolute -top-10 -left-10 text-6xl opacity-60"
              style={{ color: '#e9c349' }}
            >
              auto_awesome
            </span>
            <h1
              className="mb-4 relative z-10"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(36px, 8vw, 52px)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: text,
              }}
            >
              {heading}
            </h1>
            <span
              className="material-symbols-outlined absolute -bottom-8 -right-8 text-5xl opacity-60"
              style={{ color: accent }}
            >
              favorite
            </span>
          </div>

          {/* Subtitle */}
          <p
            className="max-w-2xl mx-auto mb-8"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 18,
              lineHeight: 1.6,
              color: text,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </p>

          {/* Countdown glass panel */}
          <div
            className="rounded-[2rem] p-8 md:p-12 w-full max-w-3xl relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 30px 60px rgba(112,88,91,0.1)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none"
              style={{
                background:
                  'linear-gradient(225deg, rgba(255,224,136,0.3), transparent)',
              }}
            />

            {s.date && (
              <>
                <h2
                  className="mb-8 text-center flex items-center justify-center gap-2"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 24,
                    fontWeight: 600,
                    color: text,
                  }}
                >
                  <span className="material-symbols-outlined">
                    hourglass_empty
                  </span>
                  {countdownLabel}
                </h2>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {countdownItems.map(({ label, value, bg: cbg, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border border-white/40"
                        style={{
                          background: cbg,
                          color,
                          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 32,
                            fontWeight: 600,
                          }}
                        >
                          {value}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          color: text,
                          opacity: 0.7,
                          textTransform: 'uppercase',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!s.date && (
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 22,
                  fontWeight: 600,
                  color: text,
                  textAlign: 'center',
                }}
              >
                {countdownLabel}
              </p>
            )}

            {/* CTA */}
            <div className="mt-12 text-center relative z-10">
              <a
                href={`/s/${slug}/journey`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: '#fff',
                  background: accent,
                  boxShadow: `0 10px 20px ${accent}44`,
                }}
              >
                <span className="material-symbols-outlined">magic_button</span>
                {buttonText}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-transparent w-full py-12 flex flex-col items-center justify-center gap-4 text-center px-6 relative z-10">
        <p
          className="flex items-center gap-2"
          style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 14,
            color: text,
            opacity: 0.6,
          }}
        >
          Made with magic and love
          <span
            className="material-symbols-outlined"
            style={{
              color: accent,
              fontVariationSettings: "'FILL' 1",
              fontSize: 16,
            }}
          >
            favorite
          </span>
        </p>
      </footer>
    </div>
  )
}
