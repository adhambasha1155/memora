'use client'

import Link from 'next/link'

export default function NotPublishedPage() {
  return (
    <main className="page">
      <div className="card">
        <div className="icon">🔒</div>
        <h1 className="title">
          This <span>Memora</span> isn&apos;t published yet
        </h1>
        <p className="subtitle">
          The creator is still working on this memory. Check back soon —
          it&apos;ll be worth the wait.
        </p>
        <Link href="/" className="btn">
          Explore Memora →
        </Link>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .page {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(
              circle at 18% 14%,
              rgba(249, 228, 236, 0.95),
              transparent 26%
            ),
            radial-gradient(
              circle at 82% 18%,
              rgba(232, 128, 158, 0.18),
              transparent 26%
            ),
            var(--warm-white);
          font-family: 'DM Sans', sans-serif;
        }
        .card {
          max-width: 440px;
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 24px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(194, 24, 91, 0.1);
        }
        .icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 12px;
          line-height: 1.15;
        }
        .title span {
          color: var(--main-rose);
        }
        .subtitle {
          font-size: 14px;
          color: var(--dusty-rose);
          line-height: 1.65;
          margin-bottom: 28px;
        }
        .btn {
          display: inline-block;
          padding: 12px 28px;
          background: var(--main-rose);
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s ease;
        }
        .btn:hover {
          background: #7a1733;
          transform: translateY(-1px);
        }
      `}</style>
    </main>
  )
}
