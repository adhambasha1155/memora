'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import { SiteData } from '@/app/lib/getSiteBySlug'
import Loading from '@/app/loading'

interface Wish {
  id: string
  name: string
  message: string
  created_at: string
}

export default function SlugWishesPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [site, setSite] = useState<SiteData | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

      const { data: wishData } = await supabase
        .from('wishes')
        .select('*')
        .eq('site_id', siteData.id)
        .order('created_at', { ascending: false })

      setSite(siteData as SiteData)
      setWishes((wishData || []) as Wish[])
      setLoading(false)
    }
    load()
  }, [slug])

  async function handleSubmit() {
    if (!site || !name.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: newWish, error } = await supabase
        .from('wishes')
        .insert({
          site_id: site.id,
          name: name.trim(),
          message: message.trim(),
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (newWish) setWishes((prev) => [newWish as Wish, ...prev])

      setName('')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
      }, 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />

  const s = site!
  const bg = s.bg_color || '#fadadd'
  const text = s.text_color || '#70585b'
  const accent = s.accent_color || '#70585b'

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
              : 'Wishes'}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(36px,8vw,48px)',
              fontWeight: 700,
              color: text,
              marginBottom: 16,
            }}
          >
            Wishes
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
            A letter, and a place to leave your own words of love.
          </p>
        </div>

        {/* The letter */}
        {s.message && (
          <div
            className="p-8 md:p-12 rounded-3xl border border-white/30 relative overflow-hidden mb-16"
            style={{
              backgroundColor: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 50px rgba(112,88,91,0.12)',
            }}
          >
            <p
              className="uppercase tracking-widest mb-6"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: accent,
              }}
            >
              {s.recipient_name
                ? `Dear ${s.recipient_name}`
                : 'A letter for you'}
            </p>
            <p
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(18px,3vw,22px)',
                lineHeight: 1.8,
                color: text,
                whiteSpace: 'pre-wrap',
              }}
            >
              {s.message}
            </p>
            {s.sender_name && (
              <p
                className="text-right mt-8"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: text,
                  opacity: 0.75,
                }}
              >
                — {s.sender_name}
              </p>
            )}
          </div>
        )}

        {/* Make a wish CTA / form */}
        <div className="mb-16">
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105"
                style={{
                  background: accent,
                  color: '#fff',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 14,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                }}
              >
                ✦ Make a wish
              </button>
            </div>
          ) : (
            <div
              className="p-6 md:p-8 rounded-3xl border border-white/30"
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {submitted ? (
                <div className="text-center py-6">
                  <p
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: 22,
                      fontWeight: 600,
                      color: text,
                    }}
                  >
                    ✦ Wish sent
                  </p>
                  <p
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: 14,
                      color: text,
                      opacity: 0.7,
                      marginTop: 8,
                    }}
                  >
                    Thank you for leaving your words.
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded-xl border outline-none"
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: 14,
                      borderColor: `${accent}33`,
                      background: 'rgba(255,255,255,0.7)',
                      color: text,
                    }}
                  />
                  <textarea
                    placeholder="Leave your wish..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded-xl border outline-none resize-none"
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: 14,
                      borderColor: `${accent}33`,
                      background: 'rgba(255,255,255,0.7)',
                      color: text,
                      lineHeight: 1.6,
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-6 py-3 rounded-full font-semibold border"
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: 13,
                        borderColor: `${accent}33`,
                        color: text,
                        background: 'transparent',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !name.trim() || !message.trim()}
                      className="flex-1 px-6 py-3 rounded-full font-semibold disabled:opacity-50"
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: 13,
                        background: accent,
                        color: '#fff',
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send wish'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Wishes list */}
        {wishes.length > 0 && (
          <div>
            <p
              className="uppercase tracking-widest mb-6 text-center"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: accent,
              }}
            >
              {wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} left so
              far
            </p>
            <div className="grid gap-4">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-5 rounded-2xl border border-white/30"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: text,
                      marginBottom: 8,
                    }}
                  >
                    {w.message}
                  </p>
                  <p
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      color: accent,
                    }}
                  >
                    — {w.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
