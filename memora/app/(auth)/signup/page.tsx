'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: ((i * 7) % 5) + 2,
  left: (i * 5.2) % 100,
  duration: ((i * 1.3) % 12) + 8,
  delay: (i * 0.7) % 8,
}))

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const checkUsername = async (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '')
    setUsername(cleaned)
    if (cleaned.length < 3) return setUsernameStatus('idle')
    setUsernameStatus('checking')
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', cleaned)
      .single()
    setUsernameStatus(data ? 'taken' : 'available')
  }

  const handleGuest = async () => {
    setLoading(true)
    const { error: guestError } = await supabase.auth.signInAnonymously()
    if (guestError) {
      setError(guestError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (usernameStatus !== 'available')
      return setError('Please choose an available username')
    setLoading(true)
    setError('')
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username, email })
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
      router.push('/dashboard')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .signup-root {
          min-height: 100vh;
          background: linear-gradient(145deg, #1a0505 0%, #3d0a0a 30%, #6b1515 60%, #8b1a1a 80%, #2a0808 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .glow-1 {
          top: -200px;
          right: -100px;
          background: radial-gradient(circle, rgba(180, 30, 30, 0.3) 0%, transparent 70%);
        }

        .glow-2 {
          bottom: -200px;
          left: -100px;
          background: radial-gradient(circle, rgba(120, 15, 15, 0.25) 0%, transparent 70%);
        }

        .glow-3 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(200, 40, 40, 0.12) 0%, transparent 70%);
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 120, 120, 0.12);
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          from { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          to { transform: translateY(-20px) scale(1); opacity: 0; }
        }

        .signup-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.7s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 400;
          color: #fff;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
        }

        .brand-tagline {
          font-size: 14px;
          color: rgba(255, 180, 180, 0.7);
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .form-card {
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 36px 32px;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 6px;
        }

        .form-subtitle {
          font-size: 13px;
          color: rgba(255, 180, 180, 0.5);
          font-weight: 300;
          margin-bottom: 28px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 24px;
        }

        .field { display: flex; flex-direction: column; gap: 7px; }

        .field label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 200, 200, 0.5);
          font-weight: 400;
        }

        .field input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease;
          width: 100%;
        }

        .field input:focus {
          border-color: rgba(255, 100, 100, 0.4);
          background: rgba(255, 255, 255, 0.09);
        }

        .field input::placeholder { color: rgba(255, 255, 255, 0.2); }

        .username-hint {
          font-size: 12px;
          margin-top: 2px;
          font-weight: 300;
        }

        .hint-checking { color: rgba(255, 200, 200, 0.5); }
        .hint-available { color: #6fcf97; }
        .hint-taken { color: #ff7b7b; }

        .error-msg {
          font-size: 12px;
          color: #ff9b9b;
          padding: 10px 14px;
          background: rgba(255, 100, 100, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 100, 100, 0.2);
          margin-bottom: 16px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #c0392b 0%, #8b1a1a 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.25s ease;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(180, 30, 30, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(180, 30, 30, 0.45);
        }

        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .divider-text {
          font-size: 11px;
          color: rgba(255, 200, 200, 0.3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .login-link {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 200, 200, 0.45);
          font-weight: 300;
        }

        .login-link a {
          color: #ff8a8a;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .login-link a:hover { color: #ffb3b3; }

        .guest-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          color: rgba(255, 200, 200, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 400;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          margin-bottom: 20px;
        }

        .guest-btn:hover {
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 220, 220, 0.8);
          background: rgba(255, 255, 255, 0.04);
        }

        .guest-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 480px) {
          .signup-root { padding: 16px; }
          .form-card { padding: 28px 20px; }
          .brand-name { font-size: 34px; }
        }
      `}</style>

      <div className="signup-root">
        <div className="bg-glow glow-1" />
        <div className="bg-glow glow-2" />
        <div className="bg-glow glow-3" />

        <div className="particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="signup-card">
          <div className="brand-section">
            <h1 className="brand-name">Memora</h1>
            <p className="brand-tagline">
              Turn your memories into an experience
            </p>
          </div>

          <div className="form-card">
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">
              Your memories deserve a beautiful home.
            </p>

            <form onSubmit={handleSignup}>
              <div className="field-group">
                <div className="field">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => checkUsername(e.target.value)}
                    placeholder="e.g. adham"
                    required
                  />
                  {usernameStatus === 'checking' && (
                    <span className="username-hint hint-checking">
                      Checking availability...
                    </span>
                  )}
                  {usernameStatus === 'available' && (
                    <span className="username-hint hint-available">
                      ✓ {username}.memora.com is yours
                    </span>
                  )}
                  {usernameStatus === 'taken' && (
                    <span className="username-hint hint-taken">
                      ✗ Username already taken
                    </span>
                  )}
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="min. 8 characters"
                    required
                  />
                </div>
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating your account...' : 'Create account'}
              </button>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or</span>
                <div className="divider-line" />
              </div>

              <button
                type="button"
                className="guest-btn"
                onClick={handleGuest}
                disabled={loading}
              >
                Continue as a guest
              </button>

              <p className="login-link">
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
