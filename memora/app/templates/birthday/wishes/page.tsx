'use client'

import { useState, useRef } from 'react'
import ConnectedNav from '@/components/ConnectedNav'

const BASE = '/templates/birthday'

export default function WishesPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleOpenForm() {
    setShowForm(true)
    setTimeout(() => textareaRef.current?.focus(), 350)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const message = textareaRef.current?.value.trim()
    if (!message) { textareaRef.current?.focus(); return }
    setSubmitted(true)
    if (textareaRef.current) textareaRef.current.value = ''
  }

  return (
    <>
      <style>{`
        @keyframes float { 0%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} 100%{transform:translateY(0) rotate(0deg)} }
        .floating-element { animation:float 6s ease-in-out infinite; }
        .floating-element-delayed { animation:float 8s ease-in-out 2s infinite; }
        @keyframes wishPanelIn { from{opacity:0;transform:translateY(18px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        .wish-panel-animate { animation:wishPanelIn .35s ease both; }
      `}</style>

      <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#fefccf', paddingBottom: 110 }}>
        {/* Blobs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full floating-element" style={{ background: '#fadadd', filter: 'blur(40px)', opacity: 0.5 }} />
          <div className="absolute top-40 right-[15%] w-72 h-72 rounded-full floating-element-delayed" style={{ background: '#e1e1f5', filter: 'blur(40px)', opacity: 0.6 }} />
          <div className="absolute bottom-20 left-[20%] w-80 h-80 rounded-full floating-element" style={{ background: '#ffdf84', filter: 'blur(40px)', opacity: 0.4 }} />
        </div>

        {/* Top bar */}
        <header className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2" style={{ background: 'rgba(254,252,207,0.8)', boxShadow: '0 20px 50px rgba(112,88,91,0.15)' }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: '#70585b' }}>auto_awesome</span>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#70585b' }}>Aria&apos;s Magic Day</span>
          </div>
        </header>

        <main className="relative z-10 pt-24 md:pt-32 pb-40 px-6 md:px-20 min-h-screen flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="material-symbols-outlined floating-element block mb-4" style={{ color: '#e9c349', fontSize: 36 }}>flare</span>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px,8vw,48px)', fontWeight: 700, color: '#70585b', marginBottom: 16 }}>A Universe of Wishes</h1>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 18, color: '#4f4445', lineHeight: 1.6, maxWidth: 512, margin: '0 auto' }}>Messages of love, sprinkled with magic, for Aria on her special day.</p>
          </div>

          {/* Bento grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-24">
            {/* Letter */}
            <div className="md:col-span-8 rounded-[2rem] p-8 md:p-12 relative flex flex-col justify-center" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 30px 60px rgba(112,88,91,0.1)' }}>
              <span className="material-symbols-outlined absolute top-6 left-6 opacity-50 -rotate-12" style={{ color: '#debfc2', fontSize: 28 }}>local_florist</span>
              <span className="material-symbols-outlined absolute bottom-6 right-6 opacity-50 rotate-12" style={{ color: '#debfc2', fontSize: 28 }}>local_florist</span>
              <h2 className="text-center italic mb-8" style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: '#70585b' }}>Dearest Aria,</h2>
              <div className="space-y-6 max-w-xl mx-auto relative z-10">
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#1d1d03', lineHeight: 1.8 }}>As you celebrate another beautiful trip around the sun, we wanted to gather all the love in the universe and place it right here. Your laughter is the magic that lights up our days, and your spirit is as bright as the morning star.</p>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#1d1d03', lineHeight: 1.8 }}>May this year bring you endless adventures, moments that make your heart skip a beat, and dreams that unfold into reality. You are loved more than words can say, and today, we celebrate everything that makes you so wonderfully you.</p>
                <p className="text-center italic pt-6" style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#765e61' }}>&ldquo;May your day be filled with sparkles and joy.&rdquo;</p>
              </div>
            </div>

            {/* Side column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Video placeholder */}
              <div className="rounded-[2rem] p-6 flex-grow flex flex-col items-center justify-center relative overflow-hidden group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 40px rgba(112,88,91,0.08)', minHeight: 200 }}>
                <div className="absolute inset-0 transition-colors duration-500 z-0" style={{ background: 'rgba(225,225,245,0.2)' }} />
                <div className="relative z-10 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(255,255,255,0.8)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#70585b', fontSize: 30, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#70585b' }}>Special Message</h3>
                  <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#4f4445' }}>Press play to see a surprise</p>
                </div>
              </div>

              {/* Make a wish button */}
              <button onClick={handleOpenForm} type="button" className="rounded-full px-6 py-4 flex items-center gap-4 justify-center hover:scale-105 transition-transform duration-300" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(112,88,91,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: '#735c00' }}>star</span>
                <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#4f4445', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Make a wish</span>
                <span className="material-symbols-outlined" style={{ color: '#735c00' }}>star</span>
              </button>
            </div>
          </div>

          {/* Wish form */}
          {showForm && (
            <div className="wish-panel-animate w-full max-w-[720px] mx-auto p-6 rounded-[2rem] mb-8" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(255,255,255,0.55)', boxShadow: '0 24px 60px rgba(112,88,91,0.12)', backdropFilter: 'blur(14px)' }}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="wishMessage" className="block mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#70585b' }}>Write your birthday wish</label>
                <textarea id="wishMessage" ref={textareaRef} placeholder="Type your message here..." className="w-full min-h-[150px] resize-y rounded-3xl px-5 py-[18px] outline-none" style={{ border: '1px solid rgba(112,88,91,.22)', background: 'rgba(255,255,255,.82)', color: '#1d1d03', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.7 }} />
                <button type="submit" className="mt-4 w-full min-h-[52px] rounded-full text-white font-bold cursor-pointer transition-all hover:-translate-y-0.5 border-0" style={{ background: '#70585b', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, boxShadow: '0 14px 30px rgba(112,88,91,.22)' }}>Send</button>
                {submitted && <p className="mt-3 text-center font-bold" style={{ color: '#70585b', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Your wish has been sent with magic ✨</p>}
              </form>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full py-12 flex flex-col items-center gap-4 text-center px-6">
          <div className="flex gap-6">
            {[['RSVP','invitation'],['Contact Sparkles','wishes'],['Our Story','journey']].map(([label,path]) => (
              <a key={path} href={`${BASE}/${path}`} className="hover:text-primary transition-colors" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445' }}>{label}</a>
            ))}
          </div>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445', marginTop: 16 }}>Made with magic and love for your special day</p>
        </footer>

        <ConnectedNav active="wishes" />
      </div>
    </>
  )
}
