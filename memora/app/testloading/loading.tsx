'use client'

export default function Loading() {
  return (
    <main className="loadingPage" aria-label="Loading Memora">
      <img
        src="/memora-logo.png"
        alt="Memora"
        className="logo"
        draggable="false"
      />

      <p className="loadingText">Preparing your memories...</p>

      <div className="progressWrap" aria-hidden="true">
        <div className="progressBar" />
      </div>

      <p className="footerText">Moments • Memories • Forever</p>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .loadingPage {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          --rose-mid: #e8809e;

          min-height: 100vh;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background:
            radial-gradient(
              circle at 16% 10%,
              rgba(249, 228, 236, 0.96),
              transparent 28%
            ),
            radial-gradient(
              circle at 86% 16%,
              rgba(232, 128, 158, 0.2),
              transparent 28%
            ),
            radial-gradient(
              circle at 50% 94%,
              rgba(194, 24, 91, 0.1),
              transparent 38%
            ),
            var(--warm-white);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 22px;
          overflow: hidden;
        }

        .logo {
          width: min(88%, 320px);
          height: auto;
          object-fit: contain;
          display: block;
          /* No background, no card, no shadow behind it */
          background: transparent;
          animation: logoFloat 2.8s ease-in-out infinite;
          user-select: none;
          pointer-events: none;
          margin-bottom: 32px;
        }

        .loadingText {
          color: var(--dusty-rose);
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-align: center;
          margin: 0 0 28px;
        }

        .progressWrap {
          width: min(100%, 260px);
          height: 6px;
          border-radius: 999px;
          background: var(--rose-blush);
          border: 1px solid rgba(194, 24, 91, 0.1);
          overflow: hidden;
          margin-bottom: 48px;
        }

        .progressBar {
          height: 100%;
          width: 45%;
          border-radius: inherit;
          background: linear-gradient(90deg, #e91e8c, #c2185b);
          box-shadow: 0 0 12px rgba(233, 30, 140, 0.3);
          animation: loadingMove 1.45s ease-in-out infinite;
        }

        .footerText {
          color: var(--rose-mid);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-align: center;
          text-transform: uppercase;
        }

        @keyframes loadingMove {
          0% {
            transform: translateX(-105%);
          }
          50% {
            transform: translateX(80%);
          }
          100% {
            transform: translateX(245%);
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 420px) {
          .logo {
            width: min(88%, 260px);
          }
          .loadingText {
            font-size: 14px;
          }
          .progressWrap {
            width: min(100%, 220px);
          }
          .footerText {
            font-size: 10px;
            letter-spacing: 0.14em;
          }
        }
      `}</style>
    </main>
  )
}
