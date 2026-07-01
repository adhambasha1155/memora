'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase'

interface Profile {
  email: string | null
  username: string | null
  display_name: string | null
}

interface NavItem {
  label: string
  href: string
  icon: string
  authRequired?: boolean
  matchPath?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: 'home' },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    authRequired: true,
  },
  {
    label: 'Create New',
    href: '/pick',
    icon: 'add_circle',
    authRequired: true,
  },
  // Account currently routes to /dashboard; change to '/account' when that page exists.
  {
    label: 'Account',
    href: '/dashboard',
    icon: 'person',
    authRequired: true,
    matchPath: '/account',
  },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const isMounted = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setAuthed(false)
        return
      }
      setAuthed(true)
      const { data: prof } = await supabase
        .from('profiles')
        .select('email, username, display_name')
        .eq('id', data.user.id)
        .maybeSingle()
      if (prof) setProfile(prof as Profile)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user)
      if (!session?.user) setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    setOpen(false)
  }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  function isActive(item: NavItem): boolean {
    const target = item.matchPath ?? item.href
    if (target === '/') return pathname === '/'
    return pathname?.startsWith(target) ?? false
  }

  const visibleItems = NAV_ITEMS.filter(
    (i) => !i.authRequired || authed === true
  )

  const initial =
    profile?.display_name?.[0]?.toUpperCase() ||
    profile?.username?.[0]?.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    '?'

  return (
    <>
      {/* HAMBURGER — top-right, no circle, just lines */}
      <button
        className={`sbToggle ${open ? 'sbToggleOpen' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className="sbBar sbBar1" />
        <span className="sbBar sbBar2" />
        <span className="sbBar sbBar3" />
      </button>

      <div
        className={`sbBackdrop ${open ? 'sbBackdropOpen' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* DRAWER — slides from the right */}
      <aside
        className={`sbDrawer ${open ? 'sbDrawerOpen' : ''}`}
        aria-hidden={!open}
        aria-label="Main navigation"
      >
        <div className="sbHeader">
          <Link href="/" className="sbBrand" onClick={() => setOpen(false)}>
            <img src="/memora-logo.png" alt="Memora" className="sbLogo" />
          </Link>
        </div>

        {authed === true && (
          <div className="sbUser">
            <div className="sbAvatar">{initial}</div>
            <div className="sbUserText">
              <div className="sbUserName">
                {profile?.display_name || profile?.username || 'Welcome'}
              </div>
              <div className="sbUserEmail">
                {profile?.username
                  ? `@${profile.username}`
                  : profile?.email || ''}
              </div>
            </div>
          </div>
        )}
        {authed === false && (
          <div className="sbSignedOut">
            <p className="sbSignedOutText">
              Sign in to start creating memories.
            </p>
            <Link
              href="/signup"
              className="sbSignInBtn"
              onClick={() => setOpen(false)}
            >
              Sign in / Create account
            </Link>
          </div>
        )}

        <nav className="sbNav">
          {visibleItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`sbLink ${isActive(item) ? 'sbLinkActive' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span
                className="material-symbols-outlined sbIcon"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="sbLabel">{item.label}</span>
              {isActive(item) && <span className="sbActiveDot" />}
            </Link>
          ))}
        </nav>

        {authed === true && (
          <div className="sbFooter">
            <button className="sbSignOut" onClick={handleSignOut}>
              <span
                className="material-symbols-outlined sbIcon"
                aria-hidden="true"
              >
                logout
              </span>
              <span>Sign out</span>
            </button>
            <div className="sbFooterTag">Moments • Memories • Forever</div>
          </div>
        )}
      </aside>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        /* HAMBURGER — no circle, just lines, top-right */
        .sbToggle {
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 1001;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px;
          transition: transform 0.22s ease;
        }
        .sbToggle:hover {
          transform: scale(1.08);
        }
        .sbToggle:hover .sbBar {
          background: #7a1733;
        }
        .sbToggle:active {
          transform: scale(0.95);
        }

        .sbBar {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: #c2185b;
          transition:
            transform 0.3s ease,
            opacity 0.22s ease,
            background 0.2s ease;
          transform-origin: center;
        }
        .sbToggleOpen .sbBar1 {
          transform: translateY(6px) rotate(45deg);
        }
        .sbToggleOpen .sbBar2 {
          opacity: 0;
        }
        .sbToggleOpen .sbBar3 {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* BACKDROP */
        .sbBackdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(44, 26, 32, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
        }
        .sbBackdropOpen {
          opacity: 1;
          pointer-events: auto;
        }

        /* DRAWER — right side */
        .sbDrawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          width: 290px;
          max-width: 85vw;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(249, 228, 236, 0.6),
              transparent 50%
            ),
            radial-gradient(
              circle at 20% 90%,
              rgba(194, 24, 91, 0.05),
              transparent 50%
            ),
            #fdf5f7;
          border-left: 1px solid rgba(194, 24, 91, 0.1);
          box-shadow: -12px 0 40px rgba(44, 26, 32, 0.12);
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          color: #2c1a20;
        }
        .sbDrawerOpen {
          transform: translateX(0);
        }

        .sbHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(194, 24, 91, 0.08);
        }
        .sbBrand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .sbLogo {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .sbUser {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(194, 24, 91, 0.08);
        }
        .sbAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c2185b, #e91e8c);
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 14px rgba(194, 24, 91, 0.22);
        }
        .sbUserText {
          flex: 1;
          min-width: 0;
        }
        .sbUserName {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 700;
          color: #2c1a20;
          line-height: 1.15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sbUserEmail {
          font-size: 11px;
          color: #8a6470;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sbSignedOut {
          padding: 22px 20px;
          border-bottom: 1px solid rgba(194, 24, 91, 0.08);
          text-align: center;
        }
        .sbSignedOutText {
          font-size: 12px;
          color: #8a6470;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .sbSignInBtn {
          display: inline-block;
          width: 100%;
          padding: 11px 16px;
          background: #c2185b;
          color: #fff;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.22s ease;
          box-shadow: 0 8px 18px rgba(194, 24, 91, 0.2);
        }
        .sbSignInBtn:hover {
          background: #7a1733;
          transform: translateY(-1px);
        }

        .sbNav {
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sbLink {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #8a6470;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .sbLink:hover {
          background: rgba(249, 228, 236, 0.6);
          color: #c2185b;
          transform: translateX(-2px);
        }
        .sbLinkActive {
          background: #f9e4ec;
          color: #7a1733;
          box-shadow: inset 0 1px 3px rgba(194, 24, 91, 0.06);
        }
        .sbLinkActive:hover {
          background: #f9e4ec;
          transform: none;
        }
        .sbIcon {
          font-size: 22px !important;
          flex-shrink: 0;
        }
        .sbLabel {
          flex: 1;
        }
        .sbActiveDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c2185b;
          box-shadow: 0 0 8px rgba(194, 24, 91, 0.5);
        }

        .sbFooter {
          padding: 14px 16px 20px;
          border-top: 1px solid rgba(194, 24, 91, 0.08);
        }
        .sbSignOut {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid rgba(194, 24, 91, 0.12);
          color: #8a6470;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .sbSignOut:hover {
          background: rgba(211, 47, 47, 0.06);
          border-color: #d32f2f;
          color: #d32f2f;
        }
        .sbFooterTag {
          margin-top: 14px;
          text-align: center;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(138, 100, 112, 0.6);
        }

        @media (prefers-reduced-motion: reduce) {
          .sbDrawer,
          .sbBackdrop,
          .sbBar,
          .sbLink,
          .sbToggle {
            transition: none !important;
          }
        }

        @media (max-width: 420px) {
          .sbToggle {
            top: 16px;
            right: 12px;
          }
          .sbDrawer {
            width: 280px;
          }
        }
      `}</style>
    </>
  )
}
