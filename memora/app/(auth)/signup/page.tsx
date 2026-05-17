'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showSigninPassword, setShowSigninPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [signinError, setSigninError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle')
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function checkUsername(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '')
    setUsername(cleaned)
    if (cleaned.length < 3) return setUsernameStatus('idle')
    setUsernameStatus('checking')
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', cleaned)
      .maybeSingle()
    setUsernameStatus(data ? 'taken' : 'available')
  }

  async function handleSignin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '').trim()

    if (!isValidEmail(email) || password.length < 6) {
      setSigninError('Please enter a valid email and password.')
      return
    }

    setSigninError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setSigninError(error.message)
      return
    }
    router.push('/dashboard')
  }

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '').trim()

    if (displayName.trim().length < 2) {
      setSignupError('Please enter your name.')
      return
    }
    if (usernameStatus !== 'available') {
      setSignupError('Please choose an available username.')
      return
    }
    if (!isValidEmail(email) || password.length < 6) {
      setSignupError('Please complete all fields correctly.')
      return
    }

    setSignupError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: displayName.trim(),
          preferred_username: username,
        },
      },
    })

    setLoading(false)

    if (error) {
      setSignupError(error.message)
      return
    }

    // Directly insert profile since email confirmation is disabled
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        username,
        display_name: displayName.trim(),
      })
      router.push('/dashboard')
    }
  }
  async function handleGoogleAuth() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  function handleForgotPassword() {
    router.push('/forgot-password')
  }

  return (
    <main className="authPage">
      <section className="authShell">
        <div className="brand">
          <img src="/memora-logo.png" alt="Memora" className="logo" />
        </div>
        <div className="authCard">
          {mode === 'signin' ? (
            <div className="header">
              <h1 className="title">
                Welcome <span>back</span>
              </h1>
              <p className="subtitle">
                Sign in to keep crafting your memories.
              </p>
            </div>
          ) : (
            <div className="header">
              <h1 className="title">
                Create your <span>Memora</span>
              </h1>
              <p className="subtitle">
                Start turning moments into shareable mini-movies.
              </p>
            </div>
          )}

          <div className="switcher">
            <button
              className={`switchBtn ${mode === 'signin' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('signin')}
            >
              Sign in
            </button>
            <button
              className={`switchBtn ${mode === 'signup' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </div>

          <div className="panel active">
            <button
              className="googleBtn"
              type="button"
              onClick={handleGoogleAuth}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="orDivider">
              <span>or</span>
            </div>

            {mode === 'signin' ? (
              <form onSubmit={handleSignin}>
                <div className="field">
                  <label htmlFor="signinEmail">Email</label>
                  <div className="inputWrap">
                    <input
                      id="signinEmail"
                      name="email"
                      type="email"
                      placeholder="you@memora.com"
                      required
                    />
                    <span className="icon">✉</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="signinPassword">Password</label>
                  <div className="inputWrap">
                    <input
                      id="signinPassword"
                      name="password"
                      type={showSigninPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      className="togglePass"
                      type="button"
                      aria-label={showSigninPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowSigninPassword(!showSigninPassword)}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {showSigninPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="row">
                  <label className="remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button
                    type="button"
                    className="textLink"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <button className="submitBtn" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
                {signinError && <div className="error">{signinError}</div>}
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <div className="field">
                  <label htmlFor="displayNameField">Your name</label>
                  <div className="inputWrap">
                    <input
                      id="displayNameField"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Adham Basha"
                      required
                    />
                    <span className="icon">👤</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="usernameField">Username</label>
                  <div className="inputWrap">
                    <input
                      id="usernameField"
                      type="text"
                      value={username}
                      onChange={(e) => checkUsername(e.target.value)}
                      placeholder="e.g. adham"
                      required
                    />
                    <span className="icon">@</span>
                  </div>
                  {usernameStatus === 'checking' && (
                    <div className="helper">Checking availability...</div>
                  )}
                  {usernameStatus === 'available' && (
                    <div className="helper available">
                      ✓ {username}.memora.com is yours
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div className="helper taken">✗ Username already taken</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="signupEmail">Email</label>
                  <div className="inputWrap">
                    <input
                      id="signupEmail"
                      name="email"
                      type="email"
                      placeholder="you@memora.com"
                      required
                    />
                    <span className="icon">✉</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="signupPassword">Password</label>
                  <div className="inputWrap">
                    <input
                      id="signupPassword"
                      name="password"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      className="togglePass"
                      type="button"
                      aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {showSignupPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="helper">
                    Use 8+ characters with a mix of letters & numbers.
                  </div>
                </div>

                <button className="submitBtn" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
                {signupError && <div className="error">{signupError}</div>}
                {signupSuccess && (
                  <div className="success">
                    Check your email to confirm your account.
                  </div>
                )}
              </form>
            )}

            <div className="bottomNote">
              {mode === 'signin' ? 'New here? ' : 'Already have one? '}
              <button
                type="button"
                className="inlineLink"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Create an account' : 'Sign in'}
              </button>
            </div>
          </div>

          <div className="footerMini">
            By continuing, you agree to Memora&apos;s Terms & Privacy.
          </div>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .authPage {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          --gold: #c99a5a;

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
          padding: 16px 12px;
          overflow-x: hidden;
        }

        .authShell {
          width: min(100%, 350px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand {
          text-align: center;
          margin-bottom: 0px;
        }

        .logo {
          height: 36px;
          width: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }
        .authCard {
          width: 100%;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(194, 24, 91, 0.08);
          border-radius: 20px;
          padding: 20px 18px 14px;
          box-shadow: 0 12px 34px rgba(194, 24, 91, 0.08);
          backdrop-filter: blur(16px);
        }

        .header {
          margin-bottom: 14px;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          line-height: 1.05;
          font-weight: 700;
          color: var(--dark-plum);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
        }

        .title span {
          color: var(--main-rose);
        }
        .subtitle {
          font-size: 11.5px;
          line-height: 1.4;
          color: var(--dusty-rose);
          font-weight: 400;
        }

        .switcher {
          width: 100%;
          padding: 4px;
          background: var(--rose-blush);
          border: 1px solid rgba(194, 24, 91, 0.07);
          border-radius: 999px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin-bottom: 14px;
        }

        .switchBtn {
          height: 36px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--dusty-rose);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .switchBtn.active {
          background: var(--main-rose);
          color: #fff;
          box-shadow: 0 6px 14px rgba(194, 24, 91, 0.15);
        }

        .googleBtn {
          width: 100%;
          min-height: 44px;
          border: 1px solid rgba(194, 24, 91, 0.15);
          border-radius: 10px;
          background: #fff;
          color: var(--dark-plum);
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.22s ease;
          margin-bottom: 10px;
        }

        .googleBtn:hover {
          background: var(--rose-blush);
        }

        .orDivider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: var(--dusty-rose);
          font-size: 9.5px;
          font-weight: 500;
        }

        .orDivider::before,
        .orDivider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(194, 24, 91, 0.1);
        }

        .panel {
          animation: softIn 0.22s ease both;
        }
        @keyframes softIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .field {
          margin-bottom: 10px;
        }
        .field label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          color: var(--dark-plum);
          margin-bottom: 4px;
        }

        .inputWrap {
          position: relative;
        }
        .inputWrap input {
          width: 100%;
          height: 38px;
          border: 1px solid rgba(194, 24, 91, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.86);
          color: var(--dark-plum);
          outline: none;
          padding: 0 36px 0 10px;
          font-size: 16px;
          transition: 0.22s ease;
        }

        @media (min-width: 421px) {
          .inputWrap input {
            font-size: 12px;
          }
        }

        .inputWrap input:focus {
          border-color: rgba(194, 24, 91, 0.34);
          box-shadow: 0 0 0 3px rgba(194, 24, 91, 0.08);
          background: #fff;
        }

        .icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(138, 100, 112, 0.7);
          font-size: 12px;
        }

        .togglePass {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 7px;
          background: rgba(249, 228, 236, 0.86);
          color: var(--main-rose);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        .togglePass .material-symbols-outlined {
          font-size: 16px;
        }

        .helper {
          margin-top: 4px;
          color: var(--dusty-rose);
          font-size: 9px;
          line-height: 1.4;
        }
        .helper.available {
          color: #2e7d32;
          font-weight: 600;
        }
        .helper.taken {
          color: var(--main-rose);
          font-weight: 600;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2px 0 12px;
        }
        .remember {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--dusty-rose);
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
        }
        .remember input {
          width: 12px;
          height: 12px;
          accent-color: var(--main-rose);
        }

        .textLink,
        .inlineLink {
          color: var(--main-rose);
          background: transparent;
          border: none;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .textLink:hover,
        .inlineLink:hover {
          text-decoration: underline;
        }

        .submitBtn {
          width: 100%;
          min-height: 44px;
          border: none;
          border-radius: 999px;
          background: var(--main-rose);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(194, 24, 91, 0.14);
          transition: 0.22s ease;
          margin-top: 4px;
        }

        .submitBtn:hover {
          transform: translateY(-1px);
          background: var(--rose-dark);
        }
        .submitBtn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .bottomNote {
          text-align: center;
          margin-top: 12px;
          color: var(--dusty-rose);
          font-size: 10px;
        }
        .error {
          margin-top: 6px;
          color: var(--main-rose);
          font-size: 10px;
          font-weight: 600;
        }
        .success {
          margin-top: 6px;
          color: #2e7d32;
          font-size: 10px;
          font-weight: 600;
        }

        .footerMini {
          text-align: center;
          margin-top: 12px;
          font-size: 9px;
          color: rgba(138, 100, 112, 0.76);
          line-height: 1.4;
        }
        .footerMini span {
          color: var(--gold);
          font-weight: 600;
        }

        @media (max-width: 420px) {
          .authShell {
            max-width: 310px;
          }
          .brand {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .authCard {
            padding: 16px 14px 12px;
          }
          .title {
            font-size: 22px;
          }
          .subtitle {
            font-size: 10.5px;
          }
          .inputWrap input {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  )
}
