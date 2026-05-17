'use client'

import { useRouter } from 'next/navigation'
import ConnectedNav from '@/components/ConnectedNav'

const BASE = '/templates/birthday'

export default function GiftBoxPage() {
  const router = useRouter()

  function openGift() {
    const box = document.getElementById('magicGiftBox')
    const glow = document.getElementById('giftGlowBurst')
    const text = document.getElementById('giftRedirectText')
    box?.classList.add('opening')
    glow?.classList.add('show')
    text?.classList.add('show')
    setTimeout(() => router.push(`${BASE}/gallery?fromGift=true`), 1100)
  }

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg,#fefccf 0%,#fadadd 100%); background-attachment:fixed; }
        .magic-gift-box { transition:transform .45s ease,filter .45s ease; }
        .magic-gift-box.opening { animation:giftOpenToGallery 1.05s ease forwards; pointer-events:none; }
        .magic-gift-box.opening .gift-lid { animation:liftLid .75s ease forwards; }
        .gift-glow-burst { position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0;background:radial-gradient(circle at center,rgba(255,224,136,.95),rgba(251,219,222,.72) 35%,transparent 70%); }
        .gift-glow-burst.show { animation:glowBurst .95s ease forwards; }
        .gift-redirect-text { opacity:0;transform:translateY(10px);transition:.35s ease; }
        .gift-redirect-text.show { opacity:1;transform:translateY(0); }
        @keyframes giftOpenToGallery {
          0% { transform:scale(1) rotate(0deg);filter:brightness(1); }
          45% { transform:scale(1.13) rotate(-3deg);filter:brightness(1.12); }
          100% { transform:scale(.72) rotate(8deg);filter:brightness(1.25);opacity:0; }
        }
        @keyframes liftLid {
          0% { transform:translateY(0) rotate(0);opacity:1; }
          100% { transform:translateY(-62px) rotate(-12deg);opacity:0; }
        }
        @keyframes glowBurst {
          0% { opacity:0;transform:scale(.65); }
          35% { opacity:1;transform:scale(1); }
          100% { opacity:0;transform:scale(1.55); }
        }
      `}</style>

      <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{ color: '#1d1d03', paddingBottom: 110 }}>
        {/* Top bar */}
        <header className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2" style={{ background: 'rgba(254,252,207,0.8)', boxShadow: '0 20px 50px rgba(112,88,91,0.15)' }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ color: '#70585b', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#70585b' }}>Aria&apos;s Magic Day</span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-32 px-6 md:px-20 relative z-10">
          {/* Decorative blobs */}
          <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full" style={{ background: '#fadadd', filter: 'blur(32px)', opacity: 0.6 }} />
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full" style={{ background: '#ffdf84', filter: 'blur(32px)', opacity: 0.5 }} />
          <span className="material-symbols-outlined absolute top-40 right-20 opacity-40 rotate-12" style={{ color: '#e9c349', fontSize: 36 }}>star</span>
          <span className="material-symbols-outlined absolute bottom-40 left-20 opacity-50 -rotate-12" style={{ color: '#debfc2', fontSize: 44 }}>favorite</span>

          <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px,8vw,48px)', fontWeight: 700, color: '#70585b', marginBottom: 16 }}>A Surprise For You</h1>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 18, color: '#4f4445', lineHeight: 1.6, maxWidth: 384, margin: '0 auto' }}>Tap the magical box to reveal your birthday surprise!</p>
            </div>

            {/* Gift box */}
            <div id="magicGiftBox" className="magic-gift-box relative w-64 h-64 cursor-pointer hover:scale-105 transition-transform duration-300 group z-20" onClick={openGift}>
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" style={{ background: '#fadadd' }} />
              <div className="gift-lid absolute inset-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,224,136,0.4)', boxShadow: '0 8px 32px rgba(112,88,91,0.15)' }}>
                <div className="absolute inset-y-0 w-8 left-1/2 -translate-x-1/2 rounded-sm" style={{ background: 'rgba(255,224,136,0.8)' }} />
                <div className="absolute inset-x-0 h-8 top-1/2 -translate-y-1/2 rounded-sm" style={{ background: 'rgba(255,224,136,0.8)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 z-10 flex items-center justify-center" style={{ background: '#735c00', borderColor: '#ffe088' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ffe088', fontSize: 14 }}>magic_button</span>
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="mt-12 px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }} onClick={openGift}>
              <span className="material-symbols-outlined" style={{ color: '#70585b', fontSize: 18 }}>touch_app</span>
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#4f4445' }}>Tap to open</span>
            </div>
            <p id="giftRedirectText" className="gift-redirect-text mt-5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#70585b' }}>Opening our memories...</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 flex flex-col items-center gap-4 text-center px-6 relative z-10">
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445' }}>Made with magic and love for your special day</p>
          <div className="flex gap-4">
            {[['RSVP','invitation'],['Contact Sparkles','wishes'],['Our Story','journey']].map(([label,path]) => (
              <a key={path} href={`${BASE}/${path}`} className="hover:text-primary transition-colors" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445' }}>{label}</a>
            ))}
          </div>
        </footer>

        <ConnectedNav active="gift-box" />
        <div id="giftGlowBurst" className="gift-glow-burst" />
      </div>
    </>
  )
}
