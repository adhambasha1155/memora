'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ConnectedNav from '@/components/ConnectedNav'

const BASE = '/templates/birthday'

const slides = [
  { index: 0, tape: 'tape-1', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzZxd9gf1gUm2drDCnxDDybFNkA6TFw25xDyjoD3KZDjAIR7HfqnqQ5GK1_L7IZaWyDsY6MYrflU9ahFRAooj-aIFVXKMWaD58XqyV7MElME0ZOwjU1-3s0wgJJfDRLQnzLcUAqYGgNXwE0qCAXIjUinF4oDRYrxa6KPBkcV3wU5aiWQ1wZrtIQtCT8k_K7Gm2NmxDuydB_sww0ITMgjcZu3G2nuXOnD-via6GGR3Prcu-zsTAooBoR6FOyJaT4uT5uOzv6d1qIY', title: 'Sweet smiles', caption: 'A memory that pops forward like magic.' },
  { index: 1, tape: 'tape-2', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNO2_XzJONfV94LeHqWbsh4qALQtED3z1j6UEd1rgg3eV5ircXxw9mxMIp8M5rXtvBkeYyzfA10gj-GoF59hmDzk92Em2QsPis8tzOT04hb_VFlqbhlE7De-LvHgsTmHpeNPoO5kBSx2P4M2JtGpDqpvboXrhwTlXkOkb8QSO-fl9cZ8bG1aXavA5ttwT8gWK7uUtMyINrjGaNh5k9KbxI1QcUTTpHdp5DpatSFpLRR57HVyjB9wrUumm08_Qd9Br2stuEUcE3GRk', title: 'Make a wish!', caption: 'Tap next and let another moment jump to the front.' },
  { index: 2, tape: 'tape-3', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNiGd7qCK_XYqnIn8uIIUoS9WTBZETeJ09Vu1keyrhdfyFVe0wkiEa5satXluybhyBQjEDgKwYcXSabaAfpLZhJ3d1YzEIeH2yr3GZETxVQmsAOnUShBeioi6s_OwXVx5eonYNKQClNGnXn3TDo-Yv5lBcpEzrud2Lm98G1P6Zoy4ErYQDWBFGyxG-4ZvK-aKaSvC4schCyYkn6B122phAMRYY4mv0t3ZvZxQtwivDYLQyNb3u1P4XCMTvh2_LNjUAMvju1LJII9U', title: 'The best day', caption: 'A messy little stack, like real photos on a table.' },
  { index: 3, tape: 'tape-1', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv56ui1R-XQxamdv6l3rqVHLnVaHraYDLrrcq8gxnJQ9dE2uzj_ctNDU6kxDyiMJsL_2nSNAE5nC9B6ghrUUO5ce1BifR-VJneqWZGpey89FtYOKZTGxkjGYL2gRhRfjlLDMutXKdEsFItr1sMRl4AVwcCpr4E8LT1K1dwhORanwdFfD7t2IRBwevwnm5UsTcR4H1IvhfvlwZHW7Fpg1tJEB0AAXKsn_pEnxBTKlM2mhxXjTVS05lbOVp1jMHmKJbGL0WegEeXu1Q', title: 'Surprises...', caption: 'Saved with love for this birthday story.' },
]

export default function GalleryPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.messy-slide-card'))
    const stack = document.getElementById('messyStack')
    const pop = document.getElementById('popMemory')
    if (!cards.length) return

    let active = 0
    const rotations = [-9, 8, -5, 12, -13, 6]
    const shifts = [0, -28, 31, -48, 52, -15]

    function render() {
      cards.forEach((card, index) => {
        const depth = (index - active + cards.length) % cards.length
        const rot = rotations[index % rotations.length]
        const x = shifts[index % shifts.length]
        card.classList.toggle('is-active', depth === 0)
        card.classList.toggle('is-behind', depth !== 0)
        card.style.setProperty('--rot', rot + 'deg')
        card.style.zIndex = String(100 - depth)
        card.style.opacity = depth === 0 ? '1' : String(Math.max(0.28, 0.72 - depth * 0.12))
        card.style.transform = depth === 0
          ? 'translateX(-50%) translateY(0px) scale(1) rotate(0deg)'
          : `translateX(calc(-50% + ${x}px)) translateY(${depth * 18}px) scale(${1 - depth * 0.055}) rotate(${rot}deg)`
      })
    }

    function goNext() { active = (active + 1) % cards.length; render() }

    pop?.addEventListener('click', goNext)
    stack?.addEventListener('click', goNext)
    render()
    if (searchParams.get('fromGift')) setTimeout(goNext, 650)
    return () => { pop?.removeEventListener('click', goNext); stack?.removeEventListener('click', goNext) }
  }, [searchParams])

  return (
    <>
      <style>{`
        .messy-gallery-shell { position:relative;width:min(78vw,360px);min-height:560px;margin:0 auto 20px; }
        .messy-stack { position:relative;height:450px;cursor:pointer;perspective:1200px; }
        .messy-slide-card { position:absolute;left:50%;top:8px;width:min(82vw,360px);min-height:420px;padding:16px 16px 54px;background:rgba(255,255,255,.94);border:1px solid rgba(255,255,255,.85);border-radius:10px;box-shadow:0 22px 60px rgba(112,88,91,.20);transform-origin:center 85%;transition:transform .62s cubic-bezier(.22,1,.36,1),opacity .42s ease,filter .42s ease;will-change:transform,opacity; }
        .messy-slide-card img { width:100%;height:285px;object-fit:cover;border-radius:7px;display:block;background:#f2f0c4; }
        .messy-slide-card h3 { margin-top:17px;text-align:center;font-family:'Playfair Display',serif;font-size:25px;line-height:1.15;color:#70585b; }
        .messy-slide-card p { margin-top:8px;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;color:#4f4445; }
        .messy-slide-card.is-active { animation:photoPop .55s cubic-bezier(.18,1.35,.45,1) both;filter:saturate(1.05); }
        .messy-slide-card.is-behind { filter:saturate(.78) blur(.2px); }
        .tape { position:absolute;top:-10px;left:50%;width:74px;height:25px;transform:translateX(-50%) rotate(4deg);background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.55);box-shadow:0 3px 10px rgba(112,88,91,.08);backdrop-filter:blur(5px); }
        .tape-2 { left:28%;transform:rotate(-9deg); }
        .tape-3 { left:72%;transform:rotate(11deg); }
        .messy-controls { margin-top:24px;display:flex;align-items:center;justify-content:center;gap:12px; }
        .messy-controls button { min-height:48px;border:0;border-radius:999px;background:rgba(255,255,255,.78);color:#70585b;box-shadow:0 12px 30px rgba(112,88,91,.12);padding:0 18px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease; }
        .messy-controls button:hover { transform:translateY(-2px);background:#fbdbde; }
        .messy-controls .main-pop { padding-inline:24px;background:#fbdbde; }
        .messy-hint { margin-top:14px;text-align:center;color:#4f4445;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px; }
        @keyframes photoPop {
          0% { transform:translateX(-50%) translateY(18px) scale(.88) rotate(var(--rot));opacity:.35; }
          65% { transform:translateX(-50%) translateY(-18px) scale(1.06) rotate(0deg);opacity:1; }
          100% { transform:translateX(-50%) translateY(0) scale(1) rotate(0deg);opacity:1; }
        }
        @media (min-width:768px) {
          .messy-gallery-shell { min-height:640px; }
          .messy-stack { height:500px; }
          .messy-slide-card { width:390px;min-height:455px; }
          .messy-slide-card img { height:310px; }
        }
      `}</style>

      <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#fefccf', color: '#1d1d03', paddingBottom: 110 }}>
        {/* Light leaks */}
        <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle at top left,rgba(250,218,221,0.4) 0%,transparent 50%)' }} />
        <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle at bottom right,rgba(255,223,132,0.3) 0%,transparent 60%)' }} />
        <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle at center right,rgba(225,225,245,0.4) 0%,transparent 40%)' }} />

        {/* Top bar */}
        <header className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 md:flex hidden items-center px-6 py-2" style={{ background: 'rgba(254,252,207,0.8)', boxShadow: '0 20px 50px rgba(112,88,91,0.15)' }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: '#70585b', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#70585b' }}>Aria&apos;s Magic Day</span>
          </div>
        </header>

        <main className="pt-[120px] pb-[160px] px-6 md:px-20 max-w-7xl mx-auto relative">
          <div className="text-center mb-16 relative z-10">
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px,8vw,48px)', fontWeight: 700, color: '#70585b', marginBottom: 16 }}>Moments of Magic</h1>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 18, color: '#4f4445', lineHeight: 1.6, maxWidth: 512, margin: '0 auto' }}>A little collection of smiles, silly faces, and magical memories we&apos;ve captured along the way.</p>
          </div>

          <section className="messy-gallery-shell">
            <div className="messy-stack" id="messyStack" aria-live="polite">
              {slides.map((slide) => (
                <div key={slide.index} className="messy-slide-card" data-index={slide.index}>
                  <div className={`tape ${slide.tape}`} />
                  <img src={slide.imgSrc} alt={slide.title} />
                  <h3>{slide.title}</h3>
                  <p>{slide.caption}</p>
                </div>
              ))}
            </div>
            <div className="messy-controls">
              <button id="popMemory" type="button" className="main-pop">Next Memory</button>
            </div>
            <p className="messy-hint">Click the photo stack too — every click brings a picture forward.</p>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 flex flex-col items-center gap-4 text-center px-6 relative z-10">
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: '#70585b', marginBottom: 8 }}>Aria&apos;s Magic Day</div>
          <div className="flex gap-6 mb-4">
            {[['RSVP','invitation'],['Contact Sparkles','wishes'],['Our Story','journey']].map(([label,path]) => (
              <a key={path} href={`${BASE}/${path}`} className="hover:text-primary transition-colors" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445' }}>{label}</a>
            ))}
          </div>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 16, color: '#4f4445', opacity: 0.7 }}>Made with magic and love for your special day</p>
        </footer>

        <ConnectedNav active="gallery" />
      </div>
    </>
  )
}
