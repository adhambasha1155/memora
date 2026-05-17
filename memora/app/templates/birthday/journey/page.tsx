'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import ConnectedNav from '@/components/ConnectedNav'

const BASE = '/templates/birthday'

const milestones = [
  {
    date: 'October 14, 2020',
    title: 'The Day We Met',
    description:
      "Under a canopy of fairy lights, a simple hello sparked a magic that hasn't faded since.",
    dateColor: '#70585b',
    iconBg: '#fadadd',
    iconColor: '#70585b',
    cardGradient: 'rgba(250,218,221,0.2)',
    rotate: '2deg',
    icon: 'favorite',
    imgSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6eceo1VcHfqcrd5g23IiJWvFqLA3dDWTWFNG_o1bWPJ7zlWVj6jm1Q0m1dfw81ECs112AXXQGJkOu7FsJwBIxYRm_03qONp-V55JDSF-qO-SxGNknxMHzV_WbHyRbXUWtG-sfHewDUcKjfVE0-uLPdo_dF1PQLgdJ04x6E7fBJTg-1k2ngui9SZbasci-W8ItcRyC-jvjZbpOpfJP5oedUzQvY1qRVN0boAO7k83MF0EzOFCed6EPB0fR6qQzHoGYO9Z_cBWtHw',
    reverse: false,
  },
  {
    date: 'July 3, 2021',
    title: 'First Adventure',
    description:
      'Getting lost together was the best thing that ever happened to us.',
    dateColor: '#735c00',
    iconBg: '#ffdf84',
    iconColor: '#735c00',
    cardGradient: 'rgba(255,223,132,0.2)',
    rotate: '-2deg',
    icon: 'flight_takeoff',
    imgSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbTRAuZOiMSYE5RGwKjG7EI6C8I6cXcxU_w-N7FN7mcSKHHzX6m74Tl-Lth6E3KOhM8tq7b3j_iO5p2WkvOiOiH3AfUCTpuPJ0mX5qpXqNq9hJsSPu5lmbMWbdPSPiWtQ3ZHIUxdriD8xCayjCF-kW41H-PDhjzODC4Metu7bjd_b23nLvfNE1oqjCnHkpxlEsz-dh9OvJS8X3iXrUlkt9RlWUpmGG-7-7IgsNzRg9YIB1XXTFFaOOt8kPt7bRKby-B99COx-rx2I',
    reverse: true,
  },
  {
    date: 'December 25, 2023',
    title: 'The Moment I Knew',
    description:
      'In a quiet room filled with laughter, everything suddenly made perfect sense.',
    dateColor: '#5c5d6e',
    iconBg: '#e1e1f5',
    iconColor: '#5c5d6e',
    cardGradient: 'rgba(225,225,245,0.2)',
    rotate: '1deg',
    icon: 'auto_awesome',
    imgSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWrJeje_BD3LtTeUoWKAp8Fku_pojZtTl_egkr0eMm-E48YejzalKZ5VvJck6nqU3kATVbmLpw-zFUM5LZSOYOZtnXbsBymyY4qUhSdBgWDg0wLis_JNgecHUxx541ZImt64jkLYKe2TfnKlh2Pc8SiUEtF9znctp7LayEQ1yiZpB2ODBAa4yLcPIY8_klaD0GzU2viP6hnINormZgv0ir2E88atbxOA6hhxXa1sNgQvn37t3darWx_S8oHGzwKMoN3f1o5AxbPs',
    reverse: false,
  },
]

export default function JourneyPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredImg, setHoveredImg] = useState<number | null>(null)

  return (
    <div
      className="min-h-screen relative overflow-x-hidden pt-24 pb-32"
      style={{ background: '#fefccf', paddingBottom: 110 }}
    >
      {/* Blobs */}
      <div
        className="absolute rounded-full"
        style={{
          background: '#fadadd',
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
          opacity: 0.5,
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
          opacity: 0.5,
          zIndex: -1,
        }}
      />

      {/* Top bar */}
      <header
        className="backdrop-blur-xl rounded-full mt-4 mx-auto w-[90%] max-w-2xl fixed top-0 left-0 right-0 z-50 border border-white/30 flex items-center px-6 py-2"
        style={{
          background: 'rgba(254,252,207,0.8)',
          boxShadow: '0 20px 50px rgba(112,88,91,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined"
            style={{ color: '#70585b', fontVariationSettings: "'FILL' 1" }}
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

      <main className="max-w-5xl mx-auto px-6 md:px-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(36px,8vw,48px)',
              fontWeight: 700,
              color: '#70585b',
              marginBottom: 16,
            }}
          >
            Our Journey
          </h2>
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 18,
              color: '#4f4445',
              lineHeight: 1.6,
            }}
          >
            Every magical moment that brought us to today.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Line desktop */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] z-0"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #fadadd 10%, #fadadd 90%, transparent)',
              transform: 'translateX(-50%)',
            }}
          />
          {/* Line mobile */}
          <div
            className="md:hidden absolute top-0 bottom-0 w-[2px] z-0"
            style={{
              left: 24,
              background:
                'linear-gradient(to bottom, transparent, #fadadd 10%, #fadadd 90%, transparent)',
            }}
          />

          {milestones.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center w-full mb-24 relative`}
            >
              {/* Text Card */}
              <div
                className={`w-full md:w-1/2 flex z-10 pl-16 md:pl-0 ${m.reverse ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-12'}`}
              >
                <div
                  className="p-6 rounded-3xl border border-white/30 w-full max-w-sm relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    boxShadow:
                      hoveredCard === i
                        ? '0 32px 64px rgba(112,88,91,0.22)'
                        : '0 20px 50px rgba(112,88,91,0.15)',
                    transform: hoveredCard === i ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${m.cardGradient}, transparent)`,
                    }}
                  />
                  <div className="relative z-10">
                    <span
                      className="block mb-2 uppercase tracking-widest"
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: m.dateColor,
                      }}
                    >
                      {m.date}
                    </span>
                    <h3
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 32,
                        fontWeight: 600,
                        color: '#1d1d03',
                        marginBottom: 12,
                      }}
                    >
                      {m.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: 16,
                        color: '#4f4445',
                        lineHeight: 1.6,
                      }}
                    >
                      {m.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dot */}
              <div
                className="absolute left-6 md:left-1/2 top-6 md:top-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 z-20"
                style={{
                  background: m.iconBg,
                  borderColor: '#fefccf',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: m.iconColor, fontSize: 20 }}
                >
                  {m.icon}
                </span>
              </div>

              {/* Photo */}
              <div
                className={`w-full md:w-1/2 z-10 pt-6 md:pt-0 pl-16 md:pl-0 ${m.reverse ? 'md:pr-12' : 'md:pl-12'}`}
              >
                <div
                  className="w-full max-w-sm h-64 rounded-3xl overflow-hidden border border-white/20"
                  style={{
                    boxShadow:
                      hoveredImg === i
                        ? '0 32px 64px rgba(112,88,91,0.25)'
                        : '0 20px 50px rgba(112,88,91,0.15)',
                    transform:
                      hoveredImg === i
                        ? 'scale(1.07) rotate(0deg)'
                        : `rotate(${m.rotate})`,
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  }}
                  onMouseEnter={() => setHoveredImg(i)}
                  onMouseLeave={() => setHoveredImg(null)}
                >
                  <img
                    src={m.imgSrc}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ConnectedNav active="journey" />
    </div>
  )
}
