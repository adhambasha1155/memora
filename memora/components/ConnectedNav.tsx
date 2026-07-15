'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  getMusicType,
  buildSpotifyEmbedUrl,
  buildSoundCloudEmbedUrl,
} from '@/app/lib/music'

interface NavLink {
  href: string
  label: string
  icon: string
  activeKey: string
}

interface ConnectedNavProps {
  active: string
  /** Override base path. Defaults to '/templates/birthday' for demo pages.
   *  Pass `/s/${slug}` for real user sites. */
  basePath?: string
  /** Pass the site's music_url to show a music toggle in the middle of the
   *  nav bar. Omit or pass null/undefined if the site has no music. */
  musicUrl?: string | null
  /** Site accent color, used to theme the SoundCloud embed. */
  accent?: string
}

export default function ConnectedNav({
  active,
  basePath,
  musicUrl,
  accent = '#c2185b',
}: ConnectedNavProps) {
  const BASE = basePath || '/templates/birthday'

  const navLinks: NavLink[] = [
    {
      href: `${BASE}/invitation`,
      label: 'Home',
      icon: 'home',
      activeKey: 'invitation',
    },
    {
      href: `${BASE}/journey`,
      label: 'Story',
      icon: 'favorite',
      activeKey: 'journey',
    },
    {
      href: `${BASE}/gift-box`,
      label: 'Gift',
      icon: 'redeem',
      activeKey: 'gift-box',
    },
    {
      href: `${BASE}/wishes`,
      label: 'Wish',
      icon: 'auto_awesome',
      activeKey: 'wishes',
    },
  ]

  const hasMusic = !!musicUrl
  const musicType = musicUrl ? getMusicType(musicUrl) : null

  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)
  const [revealed, setRevealed] = useState(false)

  // Attempt silent autoplay on mount (browsers always allow muted autoplay)
  useEffect(() => {
    if (musicType === 'direct' && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [musicType])

  function handleMusicToggle() {
    if (musicType === 'direct' && audioRef.current) {
      const next = !muted
      audioRef.current.muted = next
      if (!next) audioRef.current.play().catch(() => {})
      setMuted(next)
      return
    }
    // Spotify / SoundCloud — reveal or hide the small widget above the bar
    setRevealed((r) => !r)
  }

  const musicIsActive = musicType === 'direct' ? !muted : revealed

  // Split nav links so the music button can sit exactly in the middle
  const firstHalf = navLinks.slice(0, 2) // Home, Story
  const secondHalf = navLinks.slice(2) // Gift, Wish

  return (
    <>
      {/* Direct audio — genuinely hidden, controlled entirely by the nav icon */}
      {musicType === 'direct' && (
        <audio ref={audioRef} src={musicUrl!} loop autoPlay muted={muted} />
      )}

      {/* Spotify / SoundCloud — small visible widget, shown above the bar
          only while revealed. The visitor taps play inside it once; that
          tap has to land inside the platform's own iframe, not ours. */}
      {musicType === 'spotify' &&
        revealed &&
        (() => {
          const embedUrl = buildSpotifyEmbedUrl(musicUrl!)
          return embedUrl ? (
            <div
              className="fixed z-[9998] left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden shadow-lg"
              style={{ bottom: 86, width: 300 }}
            >
              <iframe
                src={embedUrl}
                width="300"
                height="80"
                style={{ border: 0, display: 'block' }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : null
        })()}
      {musicType === 'soundcloud' && revealed && (
        <div
          className="fixed z-[9998] left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden shadow-lg"
          style={{ bottom: 86, width: 300 }}
        >
          <iframe
            src={buildSoundCloudEmbedUrl(musicUrl!, accent)}
            width="300"
            height="80"
            style={{ border: 0, display: 'block' }}
            allow="autoplay"
            loading="lazy"
          />
        </div>
      )}

      <nav
        aria-label="Main navigation"
        className={`fixed left-1/2 bottom-[18px] -translate-x-1/2 z-[9999] grid gap-2 p-[9px] rounded-full w-[min(78vw,360px)] md:w-[min(42vw,360px)]`}
        style={{
          gridTemplateColumns: hasMusic
            ? 'repeat(5, minmax(0, 1fr))'
            : 'repeat(4, minmax(0, 1fr))',
          background: 'rgba(255,255,255,.72)',
          border: '1px solid rgba(255,255,255,.7)',
          boxShadow: '0 18px 50px rgba(112,88,91,.22)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {firstHalf.map((link) => (
          <Link
            key={link.activeKey}
            href={link.href}
            aria-label={link.label}
            className={`flex flex-col items-center justify-center min-h-[48px] rounded-full no-underline font-bold transition-all duration-200 ${
              active === link.activeKey
                ? 'bg-[#fbdbde] text-[#574144] shadow-inner'
                : 'text-[#5c5d6e] hover:bg-[rgba(251,219,222,0.65)] hover:translate-y-[-2px] hover:text-[#70585b]'
            }`}
            style={
              active === link.activeKey
                ? { boxShadow: 'inset 0 2px 8px rgba(112,88,91,.08)' }
                : {}
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 25, lineHeight: 1 }}
            >
              {link.icon}
            </span>
          </Link>
        ))}

        {hasMusic && (
          <button
            onClick={handleMusicToggle}
            aria-label={musicIsActive ? 'Mute / hide music' : 'Play music'}
            className={`flex flex-col items-center justify-center min-h-[48px] rounded-full font-bold transition-all duration-200 border-0 ${
              musicIsActive
                ? 'bg-[#fbdbde] text-[#574144] shadow-inner'
                : 'text-[#5c5d6e] hover:bg-[rgba(251,219,222,0.65)] hover:translate-y-[-2px] hover:text-[#70585b]'
            }`}
            style={{
              background: musicIsActive ? '#fbdbde' : 'transparent',
              cursor: 'pointer',
              ...(musicIsActive
                ? { boxShadow: 'inset 0 2px 8px rgba(112,88,91,.08)' }
                : {}),
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 25, lineHeight: 1 }}
            >
              music_note
            </span>
          </button>
        )}

        {secondHalf.map((link) => (
          <Link
            key={link.activeKey}
            href={link.href}
            aria-label={link.label}
            className={`flex flex-col items-center justify-center min-h-[48px] rounded-full no-underline font-bold transition-all duration-200 ${
              active === link.activeKey
                ? 'bg-[#fbdbde] text-[#574144] shadow-inner'
                : 'text-[#5c5d6e] hover:bg-[rgba(251,219,222,0.65)] hover:translate-y-[-2px] hover:text-[#70585b]'
            }`}
            style={
              active === link.activeKey
                ? { boxShadow: 'inset 0 2px 8px rgba(112,88,91,.08)' }
                : {}
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 25, lineHeight: 1 }}
            >
              {link.icon}
            </span>
          </Link>
        ))}
      </nav>
    </>
  )
}
