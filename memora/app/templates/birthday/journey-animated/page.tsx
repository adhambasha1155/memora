'use client'

import { useEffect } from 'react'
import ConnectedNav from '@/components/ConnectedNav'

const photos = [
  {
    rotate: 'rotate(-3deg) translate(-10px, -20px)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6eceo1VcHfqcrd5g23IiJWvFqLA3dDWTWFNG_o1bWPJ7zlWVj6jm1Q0m1dfw81ECs112AXXQGJkOu7FsJwBIxYRm_03qONp-V55JDSF-qO-SxGNknxMHzV_WbHyRbXUWtG-sfHewDUcKjfVE0-uLPdo_dF1PQLgdJ04x6E7fBJTg-1k2ngui9SZbasci-W8ItcRyC-jvjZbpOpfJP5oedUzQvY1qRVN0boAO7k83MF0EzOFCed6EPB0fR6qQzHoGYO9Z_cBWtHw',
    alt: 'The Day We Met',
    icon: 'favorite',
    iconBg: 'bg-primary-container/80',
    iconColor: 'text-primary',
    date: 'October 14, 2020',
    dateColor: 'text-primary',
    title: 'The Day We Met',
    description: "Under a canopy of fairy lights, a simple hello sparked a magic that hasn't faded since.",
  },
  {
    rotate: 'rotate(6deg) translate(20px, 10px)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbTRAuZOiMSYE5RGwKjG7EI6C8I6cXcxU_w-N7FN7mcSKHHzX6m74Tl-Lth6E3KOhM8tq7b3j_iO5p2WkvOiOiH3AfUCTpuPJ0mX5qpXqNq9hJsSPu5lmbMWbdPSPiWtQ3ZHIUxdriD8xCayjCF-kW41H-PDhjzODC4Metu7bjd_b23nLvfNE1oqjCnHkpxlEsz-dh9OvJS8X3iXrUlkt9RlWUpmGG-7-7IgsNzRg9YIB1XXTFFaOOt8kPt7bRKby-B99COx-rx2I',
    alt: 'First Adventure',
    icon: 'flight_takeoff',
    iconBg: 'bg-tertiary-container/80',
    iconColor: 'text-tertiary',
    date: 'July 3, 2021',
    dateColor: 'text-tertiary',
    title: 'First Adventure',
    description: 'Getting lost together was the best thing that ever happened to us.',
  },
  {
    rotate: 'rotate(-8deg) translate(-15px, 25px)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWrJeje_BD3LtTeUoWKAp8Fku_pojZtTl_egkr0eMm-E48YejzalKZ5VvJck6nqU3kATVbmLpw-zFUM5LZSOYOZtnXbsBymyY4qUhSdBgWDg0wLis_JNgecHUxx541ZImt64jkLYKe2TfnKlh2Pc8SiUEtF9znctp7LayEQ1yiZpB2ODBAa4yLcPIY8_klaD0GzU2viP6hnINormZgv0ir2E88atbxOA6hhxXa1sNgQvn37t3darWx_S8oHGzwKMoN3f1o5AxbPs',
    alt: 'The Moment I Knew',
    icon: 'auto_awesome',
    iconBg: 'bg-secondary-container/80',
    iconColor: 'text-secondary',
    date: 'December 25, 2023',
    dateColor: 'text-secondary',
    title: 'The Moment I Knew',
    description: 'In a quiet room filled with laughter, everything suddenly made perfect sense.',
  },
]

export default function JourneyAnimatedPage() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.photo-card')
    const prevBtn = document.getElementById('prev-btn')
    const nextBtn = document.getElementById('next-btn')
    let currentIndex = 0

    const baseTransforms = [
      'rotate(-3deg) translate(-10px, -20px)',
      'rotate(6deg) translate(20px, 10px)',
      'rotate(-8deg) translate(-15px, 25px)',
    ]

    function updateDeck() {
      cards.forEach((card, index) => {
        card.classList.remove('active')
        if (index === currentIndex) {
          card.classList.add('active')
          card.style.zIndex = '10'
        } else {
          card.style.zIndex = String(index < currentIndex ? index : cards.length - index)
          card.style.transform = baseTransforms[index]
        }
      })
    }

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (currentIndex !== index) {
          currentIndex = index
          updateDeck()
        }
      })
    })

    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length
      updateDeck()
    })

    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length
      updateDeck()
    })

    updateDeck()
  }, [])

  return (
    <>
      <style>{`
        .deck-container { position: relative; height: 500px; perspective: 1000px; display: flex; justify-content: center; align-items: center; }
        .photo-card { position: absolute; transition: all 0.5s cubic-bezier(0.4,0,0.2,1); transform-origin: center center; cursor: pointer; width: 100%; max-width: 320px; z-index: 1; }
        .photo-card.active { z-index: 10; transform: scale(1.05) translateZ(50px) rotate(0deg) !important; }
        .photo-card.active .photo-details { opacity: 1; max-height: 200px; margin-top: 1rem; }
        .photo-details { opacity: 0; max-height: 0; overflow: hidden; transition: all 0.5s ease; }
        .glass-panel { background-color: rgba(255,255,255,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      <div
        className="bg-background text-on-background min-h-screen relative overflow-x-hidden pt-24 pb-32"
        style={{ paddingBottom: 110 }}
      >
        {/* Background Blobs */}
        <div
          className="absolute bg-primary-container w-[40vw] h-[40vw] top-[10%] left-[-10%] rounded-full"
          style={{ filter: 'blur(40px)', opacity: 0.5, zIndex: -1 }}
        />
        <div
          className="absolute bg-tertiary-container w-[30vw] h-[30vw] top-[40%] right-[-5%] rounded-full"
          style={{ filter: 'blur(40px)', opacity: 0.5, zIndex: -1 }}
        />
        <div
          className="absolute bg-secondary-container w-[50vw] h-[50vw] bottom-[-10%] left-[20%] rounded-full"
          style={{ filter: 'blur(40px)', opacity: 0.5, zIndex: -1 }}
        />

        {/* TopAppBar */}
        <header
          className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center justify-between px-6 py-2"
          style={{ boxShadow: '0 20px 50px rgba(112,88,91,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary dark:text-primary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h1 className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed-dim tracking-tight">
              Aria&apos;s Magic Day
            </h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-container-padding-mobile md:px-container-padding-desktop relative z-10">
          <div className="text-center mb-12 relative">
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-4">Our Journey</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Every magical moment that brought us to today.
            </p>
          </div>

          {/* Interactive Photo Deck */}
          <div className="deck-container w-full max-w-lg mx-auto mb-24" id="photo-deck">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="photo-card glass-panel p-4 rounded-3xl border border-white/40"
                style={{
                  transform: photo.rotate,
                  boxShadow: '0 20px 50px rgba(112,88,91,0.15)',
                  ...(i === 0 ? {} : {}),
                }}
              >
                <div className="relative rounded-2xl overflow-hidden mb-2">
                  <div
                    className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 ${photo.iconBg} backdrop-blur-sm rounded-full z-20`}
                  >
                    <span className={`material-symbols-outlined ${photo.iconColor} text-sm`}>{photo.icon}</span>
                  </div>
                  <img src={photo.imgSrc} alt={photo.alt} className="w-full h-64 object-cover" />
                </div>
                <div className="photo-details bg-white/50 rounded-xl p-4">
                  <span className={`font-label-sm text-label-sm ${photo.dateColor} mb-1 block tracking-widest uppercase`}>
                    {photo.date}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 text-xl">{photo.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{photo.description}</p>
                </div>
              </div>
            ))}

            {/* Deck Controls */}
            <div className="absolute -bottom-16 flex justify-center gap-4 w-full z-30">
              <button
                id="prev-btn"
                className="w-12 h-12 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-md flex items-center justify-center text-primary hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                id="next-btn"
                className="w-12 h-12 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-md flex items-center justify-center text-primary hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </main>

        <ConnectedNav active="journey" />
      </div>
    </>
  )
}
