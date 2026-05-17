import type { Metadata } from 'next'
import ConnectedNav from '@/components/ConnectedNav'

export const metadata: Metadata = {
  title: "Aria's Magic Day",
}

const BASE = '/templates/birthday'

const countdownItems = [
  { label: 'Days', value: '12', bg: '#fadadd', color: '#765e61' },
  { label: 'Hours', value: '08', bg: '#e1e1f5', color: '#626374' },
  { label: 'Mins', value: '45', bg: '#ffdf84', color: '#7a6100' },
]

export default function InvitationPage() {
  return (
    <div
      className="bg-background text-on-background min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
      style={{ paddingBottom: 110 }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-bright via-primary-container/20 to-tertiary-container/30" />
        <div
          className="absolute w-96 h-96 rounded-full -top-20 -left-20"
          style={{ background: '#fadadd', filter: 'blur(40px)', opacity: 0.6 }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bottom-0 right-[-100px]"
          style={{ background: '#ffdf84', filter: 'blur(40px)', opacity: 0.6 }}
        />
        <div
          className="absolute w-72 h-72 rounded-full top-1/2 left-1/4"
          style={{ background: '#e1e1f5', filter: 'blur(40px)', opacity: 0.6 }}
        />
        <span
          className="material-symbols-outlined absolute top-1/4 right-1/4 text-4xl opacity-50 rotate-12"
          style={{ color: '#e9c349' }}
        >
          star
        </span>
        <span
          className="material-symbols-outlined absolute top-1/3 left-10 text-5xl opacity-40 -rotate-12"
          style={{ color: '#debfc2' }}
        >
          favorite
        </span>
        <span
          className="material-symbols-outlined absolute bottom-1/4 left-1/3 text-3xl opacity-60 rotate-45"
          style={{ color: '#e9c349' }}
        >
          auto_awesome
        </span>
        <span
          className="material-symbols-outlined absolute bottom-20 right-20 text-4xl opacity-50 -rotate-6"
          style={{ color: '#debfc2' }}
        >
          favorite
        </span>
      </div>

      {/* Top bar */}
      <header
        className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2 transition-all hover:scale-105 duration-300"
        style={{
          background: 'rgba(254,252,207,0.8)',
          boxShadow: '0 20px 50px rgba(112,88,91,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined"
            style={{ color: '#70585b' }}
          >
            auto_awesome
          </span>
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 24,
              fontWeight: 600,
              color: '#70585b',
            }}
          >
            Aria&apos;s Magic Day
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="pt-[120px] pb-32 px-6 md:px-20 min-h-screen flex flex-col items-center justify-center relative">
        <section className="text-center w-full max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
          {/* Title */}
          <div className="relative">
            <span
              className="material-symbols-outlined absolute -top-10 -left-10 text-6xl opacity-70"
              style={{ color: '#e9c349' }}
            >
              auto_awesome
            </span>
            <h1
              className="mb-4 relative z-10"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#70585b',
              }}
            >
              Happy Birthday Aria!
            </h1>
            <span
              className="material-symbols-outlined absolute -bottom-8 -right-8 text-5xl opacity-70"
              style={{ color: '#debfc2' }}
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
              color: '#4f4445',
            }}
          >
            Join us for a magical celebration filled with wonder, joy, and
            sparkling surprises. Get ready to enter a world of enchantment.
          </p>

          {/* Countdown glass panel */}
          <div
            className="rounded-[2rem] p-8 md:p-12 w-full max-w-3xl relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
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

            <h2
              className="mb-8 text-center flex items-center justify-center gap-2"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1.4,
                color: '#765e61',
              }}
            >
              <span className="material-symbols-outlined">hourglass_empty</span>
              The Magic Begins In...
            </h2>

            {/* Countdown circles */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {countdownItems.map(({ label, value, bg, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border border-white/40"
                    style={{
                      background: bg,
                      color: color,
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
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      color: '#4f4445',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center relative z-10">
              <a
                href={`${BASE}/journey`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: '#fff',
                  background: 'linear-gradient(to right, #70585b, #8b6e71)',
                  boxShadow: '0 10px 20px rgba(112,88,91,0.2)',
                }}
              >
                <span className="material-symbols-outlined">magic_button</span>
                Enter the Magic
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-transparent w-full py-12 flex flex-col items-center justify-center gap-4 text-center px-6 relative z-10">
        <div className="flex gap-6 mb-2">
          {[
            { label: 'RSVP', href: `${BASE}/invitation` },
            { label: 'Contact Sparkles', href: `${BASE}/wishes` },
            { label: 'Our Story', href: `${BASE}/journey` },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hover:text-primary transition-colors"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 16,
                color: '#4f4445',
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <p
          className="flex items-center gap-2"
          style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 16,
            color: '#4f4445',
          }}
        >
          Made with magic and love for your special day
          <span
            className="material-symbols-outlined"
            style={{ color: '#70585b', fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </p>
      </footer>

      <ConnectedNav active="invitation" />
    </div>
  )
}
