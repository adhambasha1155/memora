'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <main className="fpPage">
      <section className="fpShell">
        <div className="brand">
          <img src="/memora-logo.png" alt="Memora" className="logo" />
        </div>
        <div className="fpCard">
          {sent ? (
            <div className="sentState">
              <div className="sentIcon">✉</div>
              <h1 className="title">
                Check your <span>email</span>
              </h1>
              <p className="subtitle">
                We&apos;ve sent a password reset link to{' '}
                <strong>{email}</strong>. It may take a minute to arrive.
              </p>
              <Link href="/signup" className="backLink">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="header">
                <h1 className="title">
                  Forgot <span>password?</span>
                </h1>
                <p className="subtitle">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="fpEmail">Email</label>
                  <div className="inputWrap">
                    <input
                      id="fpEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@memora.com"
                      required
                    />
                    <span className="icon">✉</span>
                  </div>
                </div>

                {error && <div className="error">{error}</div>}

                <button className="submitBtn" type="submit" disabled={loading}>
                  {loading ? 'Sending link…' : 'Send reset link'}
                </button>
              </form>

              <div className="bottomNote">
                Remember your password?{' '}
                <Link href="/signup" className="inlineLink">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .fpPage {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;

          min-height: 100vh;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
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
            radial-gradient(
              circle at 50% 90%,
              rgba(194, 24, 91, 0.08),
              transparent 34%
            ),
            var(--warm-white);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px 14px;
          overflow-x: hidden;
        }

        .fpShell {
          width: min(100%, 380px);
        }

        .brand {
          text-align: center;
          margin-bottom: 0px;
        }

        .logo {
          height: 73px;
          width: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }
        .fpCard {
          width: 100%;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 24px;
          padding: 24px 22px 18px;
          box-shadow: 0 18px 44px rgba(194, 24, 91, 0.1);
          backdrop-filter: blur(16px);
        }

        .header {
          margin-bottom: 17px;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          line-height: 1.05;
          font-weight: 700;
          color: var(--dark-plum);
          letter-spacing: -0.025em;
          margin-bottom: 5px;
        }

        .title span {
          color: var(--main-rose);
        }

        .subtitle {
          font-size: 12px;
          line-height: 1.55;
          color: var(--dusty-rose);
          font-weight: 400;
        }

        .subtitle strong {
          color: var(--dark-plum);
          font-weight: 600;
        }

        .sentState {
          text-align: center;
          padding: 8px 0;
        }

        .sentIcon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .sentState .title {
          margin-bottom: 8px;
        }

        .sentState .subtitle {
          margin-bottom: 18px;
        }

        .backLink {
          color: var(--main-rose);
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
        }

        .backLink:hover {
          text-decoration: underline;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: var(--dark-plum);
          margin-bottom: 6px;
        }

        .inputWrap {
          position: relative;
        }

        .inputWrap input {
          width: 100%;
          height: 40px;
          border: 1px solid rgba(194, 24, 91, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.86);
          color: var(--dark-plum);
          outline: none;
          padding: 0 40px 0 12px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: 0.22s ease;
        }

        .inputWrap input::placeholder {
          color: rgba(138, 100, 112, 0.62);
        }

        .inputWrap input:focus {
          border-color: rgba(194, 24, 91, 0.34);
          box-shadow: 0 0 0 3px rgba(194, 24, 91, 0.08);
          background: #fff;
        }

        .icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(138, 100, 112, 0.74);
          font-size: 13px;
          pointer-events: none;
        }

        .error {
          margin-bottom: 12px;
          color: var(--main-rose);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1.45;
        }

        .submitBtn {
          width: 100%;
          height: 41px;
          border: none;
          border-radius: 11px;
          background: var(--main-rose);
          color: #fff;
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(194, 24, 91, 0.16);
          transition: 0.22s ease;
        }

        .submitBtn:hover {
          transform: translateY(-1px);
          background: var(--rose-dark);
          box-shadow: 0 16px 30px rgba(194, 24, 91, 0.2);
        }

        .submitBtn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .bottomNote {
          text-align: center;
          margin-top: 13px;
          color: var(--dusty-rose);
          font-size: 10.5px;
          line-height: 1.5;
        }

        .inlineLink {
          color: var(--main-rose);
          text-decoration: none;
          font-size: 10.5px;
          font-weight: 600;
        }

        .inlineLink:hover {
          text-decoration: underline;
        }

        @media (max-width: 420px) {
          .fpPage {
            padding: 16px 12px;
          }

          .brand {
            font-size: 27px;
            margin-bottom: 14px;
          }

          .fpCard {
            padding: 21px 16px 16px;
            border-radius: 20px;
          }

          .title {
            font-size: 27px;
          }

          .inputWrap input,
          .submitBtn {
            height: 39px;
          }
        }
      `}</style>
    </main>
  )
}
