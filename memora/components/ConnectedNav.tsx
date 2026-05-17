'use client'

import Link from 'next/link'

interface NavLink {
  href: string
  label: string
  icon: string
  activeKey: string
}

const BASE = '/templates/birthday'

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

interface ConnectedNavProps {
  active: string
}

export default function ConnectedNav({ active }: ConnectedNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-1/2 bottom-[18px] -translate-x-1/2 z-[9999] grid grid-cols-4 gap-2 p-[9px] rounded-full w-[min(78vw,360px)] md:w-[min(42vw,360px)]"
      style={{
        background: 'rgba(255,255,255,.72)',
        border: '1px solid rgba(255,255,255,.7)',
        boxShadow: '0 18px 50px rgba(112,88,91,.22)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      {navLinks.map((link) => (
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
  )
}
