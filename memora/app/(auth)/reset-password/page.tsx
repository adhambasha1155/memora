'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <main className="rpPage">
      <section className="rpShell">
        <div className="brand">
          <img src="/memora-logo.png" alt="Memora" className="logo" />
        </div>

        <div className="rpCard">
          {success ? (
            <div className="successState">
              <div className="successIcon">✓</div>
              <h1 className="title">
                Password <span>updated</span>
              </h1>
              <p className="subtitle">Redirecting you to your dashboard…</p>
            </div>
          ) : (
            <>
              <div className="header">
                <h1 className="title">
                  Set new <span>password</span>
                </h1>
                <p className="subtitle">
                  Choose a new password for your Memora account.
                </p>
              </div>

              <form onSubmit={handleReset}>
                <div className="field">
                  <label htmlFor="newPassword">New password</label>
                  <div className="inputWrap">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="min. 8 characters"
                      required
                      minLength={8}
                    />
                    <button
                      className="togglePass"
                      type="button"
                      onClick={() => setShowPassword((c) => !c)}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <div className="inputWrap">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="re-enter your password"
                      required
                      minLength={8}
                    />
                  </div>
                  {confirmPassword.length > 0 &&
                    password !== confirmPassword && (
                      <div className="helper mismatch">
                        Passwords do not match
                      </div>
                    )}
                  {confirmPassword.length >= 8 &&
                    password === confirmPassword && (
                      <div className="helper match">✓ Passwords match</div>
                    )}
                </div>

                {error && <div className="error">{error}</div>}

                <button className="submitBtn" type="submit" disabled={loading}>
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .rpPage {
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

        .rpShell {
          width: min(100%, 380px);
        }

        .brand {
          text-align: center;
          margin-bottom: 0px;
        }

        .logo {
          height: 63px;
          width: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }

        .rpCard {
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

        .successState {
          text-align: center;
          padding: 16px 0;
        }

        .successIcon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--main-rose);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }

        .successState .title {
          margin-bottom: 8px;
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

        .togglePass {
          position: absolute;
          right: 7px;
          top: 50%;
          transform: translateY(-50%);
          width: 27px;
          height: 27px;
          border: none;
          border-radius: 8px;
          background: rgba(249, 228, 236, 0.86);
          color: var(--main-rose);
          cursor: pointer;
          font-size: 11px;
        }

        .helper {
          margin-top: 5px;
          font-size: 9.5px;
          line-height: 1.45;
        }

        .helper.match {
          color: #2e7d32;
          font-weight: 600;
        }

        .helper.mismatch {
          color: var(--main-rose);
          font-weight: 600;
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

        @media (max-width: 420px) {
          .rpPage {
            padding: 16px 12px;
          }

          .brand {
            font-size: 27px;
            margin-bottom: 14px;
          }

          .rpCard {
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
