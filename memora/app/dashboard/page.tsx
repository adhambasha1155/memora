'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/app/loading'

type Profile = {
  username: string
  email: string
  avatar_url: string | null
  display_name: string | null
}
type Site = {
  id: string
  slug: string
  occasion: string | null
  recipient_name: string | null
  template_id: number
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signup')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, email, avatar_url, display_name')
        .eq('id', user.id)
        .maybeSingle()

      if (profileData) setProfile(profileData)

      const { data: sitesData } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (sitesData) setSites(sitesData)
      setLoading(false)
    }
    load()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleDelete(siteId: string) {
    // Fetch media rows first so we know which R2 files to delete
    const { data: mediaRows } = await supabase
      .from('media')
      .select('file_url')
      .eq('site_id', siteId)

    if (mediaRows) {
      const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      for (const row of mediaRows) {
        if (base && row.file_url?.startsWith(base)) {
          const key = row.file_url.slice(base.length + 1)
          fetch('/api/r2/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
          }).catch((e) => console.error('Failed to delete R2 file:', e))
        }
      }
    }

    await supabase.from('media').delete().eq('site_id', siteId)
    await supabase.from('sites').delete().eq('id', siteId)
    setSites(sites.filter((s) => s.id !== siteId))
    setDeleteId(null)
  }

  async function handlePublish(siteId: string, currentlyPublished: boolean) {
    await supabase
      .from('sites')
      .update({ is_published: !currentlyPublished })
      .eq('id', siteId)
    setSites(
      sites.map((s) =>
        s.id === siteId ? { ...s, is_published: !currentlyPublished } : s
      )
    )
  }

  function copyLink(slug: string) {
    const link = `${window.location.origin}/s/${slug}`
    navigator.clipboard.writeText(link)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  const templateNames: Record<number, string> = {
    1: 'Cinematic',
    2: 'Romantic',
    3: 'Playful',
    4: 'Elegant',
    5: 'Minimal',
  }

  if (loading) return <Loading />

  return (
    <main className="dashPage">
      <nav className={`dashNav ${scrolled ? 'scrolled' : ''}`}>
        <div className="dashNavInner">
          <Link href="/" className="dashBrand">
            <img src="/memora-logo.png" alt="Memora" className="logo" />
          </Link>
        </div>
      </nav>

      <div className="dashContent">
        <div className="dashInner">
          <div className="dashHeader">
            <div>
              <h1 className="dashGreeting">
                Hi, <span>{profile?.display_name || profile?.username}</span>
              </h1>
              <p className="dashSub">
                {sites.length === 0
                  ? 'Create your first memory website.'
                  : `You have ${sites.length} ${sites.length === 1 ? 'site' : 'sites'}.`}
              </p>
            </div>
          </div>

          {sites.length > 0 ? (
            <div className="sitesGrid">
              {sites.map((site) => (
                <div key={site.id} className="siteCard">
                  <div className="siteCardTop">
                    <div className="siteTemplateBadge">
                      {templateNames[site.template_id] || 'Template'}
                    </div>
                    <div
                      className={`siteStatus ${site.is_published ? 'live' : 'draft'}`}
                    >
                      {site.is_published ? '● Live' : '○ Draft'}
                    </div>
                  </div>

                  <div className="siteCardBody">
                    <h3 className="siteName">
                      {site.recipient_name
                        ? `${site.occasion || 'Memory'} — ${site.recipient_name}`
                        : site.slug}
                    </h3>
                    <div className="siteLink">
                      {window?.location?.origin}/s/{site.slug}
                    </div>
                  </div>

                  <div className="siteCardStats">
                    <div className="siteStat">
                      <span
                        className="material-symbols-outlined statIcon"
                        aria-hidden="true"
                      >
                        visibility
                      </span>
                      <span>{site.view_count} views</span>
                    </div>
                    <div className="siteStat">
                      <span
                        className="material-symbols-outlined statIcon"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      <span>
                        {new Date(site.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="siteCardActions">
                    <button
                      className={`siteActionBtn publish ${site.is_published ? 'unpublish' : ''}`}
                      onClick={() => handlePublish(site.id, site.is_published)}
                      aria-label={site.is_published ? 'Unpublish' : 'Publish'}
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        {site.is_published ? 'cloud_off' : 'cloud_upload'}
                      </span>
                      <span>{site.is_published ? 'Unpublish' : 'Publish'}</span>
                    </button>
                    <button
                      className="siteActionBtn copy"
                      onClick={() => copyLink(site.slug)}
                      aria-label={
                        copied === site.slug ? 'Link copied' : 'Copy link'
                      }
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        {copied === site.slug ? 'check' : 'link'}
                      </span>
                      <span aria-live="polite" aria-atomic="true">
                        {copied === site.slug ? 'Copied' : 'Copy link'}
                      </span>
                    </button>
                    <Link
                      href={`/edit/${site.id}`}
                      className="siteActionBtn edit"
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        edit
                      </span>
                      Edit
                    </Link>
                    <button
                      className="siteActionBtn delete"
                      onClick={() => setDeleteId(site.id)}
                      aria-label="Delete this site"
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyEmoji">✨</div>
              <h2 className="emptyTitle">No memories yet</h2>
              <p className="emptyDesc">
                Create your first cinematic memory website and share it with
                someone special.
              </p>
              <Link href="/pick" className="emptyStateBtn">
                Create your first Memora
              </Link>
            </div>
          )}

          <div className="createBar">
            <Link href="/pick" className="createBtn">
              + Create new Memora
            </Link>
          </div>
        </div>
      </div>

      {deleteId && (
        <div className="modalOverlay" onClick={() => setDeleteId(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalEmoji">⚠️</div>
            <h3 className="modalTitle">Delete this Memora?</h3>
            <p className="modalDesc">
              This will permanently delete the site and all its media. This
              action cannot be undone.
            </p>
            <div className="modalActions">
              <button
                className="modalBtn cancel"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="modalBtn confirm"
                onClick={() => handleDelete(deleteId)}
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{dashStyles}</style>
    </main>
  )
}

const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .dashPage {
    --warm-white: #fdf5f7;
    --rose-blush: #f9e4ec;
    --main-rose: #c2185b;
    --rose-dark: #7a1733;
    --dark-plum: #2c1a20;
    --dusty-rose: #8a6470;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    color: var(--dark-plum);
    background:
      radial-gradient(circle at 10% 10%, rgba(249, 228, 236, 0.7), transparent 30%),
      radial-gradient(circle at 90% 90%, rgba(194, 24, 91, 0.04), transparent 30%),
      var(--warm-white);
  }

  .dashNav {
    padding: 0 24px;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 50;
    background: transparent;
    transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .dashNav.scrolled {
    background: rgba(253, 245, 247, 0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(194, 24, 91, 0.08);
    box-shadow: 0 4px 20px rgba(194, 24, 91, 0.06);
  }
  .dashNavInner {
    max-width: 1100px; margin: 0 auto;
    height: 64px; display: flex; align-items: center;
  }
  .dashBrand { text-decoration: none; display: flex; align-items: center; }
  .logo { height: 36px; width: auto; object-fit: contain; }

  .dashContent { padding: 104px 24px 80px; }
  .dashInner { max-width: 1000px; margin: 0 auto; }
  .dashHeader { margin-bottom: 32px; }
  .dashGreeting {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 700; color: var(--dark-plum);
    margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .dashGreeting span { color: var(--main-rose); }
  .dashSub { font-size: 13px; color: var(--dusty-rose); font-weight: 400; }

  .sitesGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px; margin-bottom: 32px;
  }
  .siteCard {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(194, 24, 91, 0.08);
    border-radius: 18px; padding: 20px;
    backdrop-filter: blur(8px); transition: 0.25s ease;
    animation: fadeUp 0.4s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .siteCard:hover {
    border-color: rgba(194, 24, 91, 0.18);
    box-shadow: 0 12px 32px rgba(194, 24, 91, 0.08);
    transform: translateY(-2px);
  }
  .siteCardTop { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .siteTemplateBadge {
    padding: 4px 10px; background: var(--rose-blush);
    border-radius: 999px; font-size: 10px; font-weight: 600;
    color: var(--main-rose); letter-spacing: 0.04em;
  }
  .siteStatus { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
  .siteStatus.live  { color: #2e7d32; }
  .siteStatus.draft { color: var(--dusty-rose); }
  .siteCardBody { margin-bottom: 14px; }
  .siteName {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--dark-plum);
    margin-bottom: 6px; line-height: 1.2;
  }
  .siteLink { font-size: 11px; color: var(--dusty-rose); font-weight: 400; word-break: break-all; }
  .siteCardStats {
    display: flex; gap: 16px; margin-bottom: 16px;
    padding-top: 12px; border-top: 1px solid rgba(194, 24, 91, 0.06);
  }
  .siteStat { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--dusty-rose); }
  .statIcon { font-size: 14px !important; }
  .siteCardActions { display: flex; gap: 8px; flex-wrap: wrap; }
  .siteActionBtn {
    flex: 1; min-height: 44px; border-radius: 999px;
    font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 4px; transition: 0.2s ease; text-decoration: none;
  }
  .siteActionBtn .material-symbols-outlined { font-size: 16px; }
  .siteActionBtn.publish {
    background: transparent;
    border: 1px solid rgba(46, 125, 50, 0.3);
    color: #2e7d32;
  }
  .siteActionBtn.publish:hover {
    background: rgba(46, 125, 50, 0.08);
    border-color: #2e7d32;
  }
  .siteActionBtn.publish.unpublish {
    border-color: rgba(194, 24, 91, 0.2);
    color: var(--dusty-rose);
  }
  .siteActionBtn.publish.unpublish:hover {
    background: var(--rose-blush);
    border-color: var(--main-rose);
    color: var(--main-rose);
  }
  .siteActionBtn.copy { background: transparent; border: 1px solid rgba(194, 24, 91, 0.2); color: var(--main-rose); }
  .siteActionBtn.copy:hover { background: var(--rose-blush); border-color: var(--main-rose); }
  .siteActionBtn.edit { background: var(--main-rose); border: 1px solid var(--main-rose); color: #fff; }
  .siteActionBtn.edit:hover { background: var(--rose-dark); border-color: var(--rose-dark); }
  .siteActionBtn.delete {
    flex: 0 0 44px; background: transparent;
    border: 1px solid rgba(194, 24, 91, 0.12);
    color: rgba(138, 100, 112, 0.5); padding: 0;
  }
  .siteActionBtn.delete:hover { border-color: #d32f2f; color: #d32f2f; background: rgba(211, 47, 47, 0.06); }

  .emptyState {
    text-align: center; padding: 60px 20px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px dashed rgba(194, 24, 91, 0.15);
    border-radius: 20px; margin-bottom: 32px;
  }
  .emptyEmoji  { font-size: 40px; margin-bottom: 14px; }
  .emptyTitle { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--dark-plum); margin-bottom: 8px; }
  .emptyDesc { font-size: 13px; color: var(--dusty-rose); font-weight: 300; max-width: 340px; margin: 0 auto 24px; line-height: 1.6; }
  .emptyStateBtn {
    display: inline-block; padding: 14px 28px;
    background: var(--main-rose); color: #fff;
    border-radius: 999px; font-size: 13px; font-weight: 600;
    text-decoration: none; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 24px rgba(194, 24, 91, 0.2); transition: 0.2s ease;
  }
  .emptyStateBtn:hover { background: var(--rose-dark); transform: translateY(-2px); }

  .createBar { display: flex; justify-content: center; padding: 24px 0; border-top: 1px solid rgba(194, 24, 91, 0.08); }
  .createBtn {
    padding: 14px 32px; background: var(--main-rose); color: #fff;
    border-radius: 999px; font-size: 13px; font-weight: 600;
    text-decoration: none; font-family: 'DM Sans', sans-serif;
    transition: 0.2s ease; box-shadow: 0 8px 24px rgba(194, 24, 91, 0.2);
  }
  .createBtn:hover { background: var(--rose-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(194, 24, 91, 0.3); }

  .modalOverlay {
    position: fixed; inset: 0;
    background: rgba(44, 26, 32, 0.5);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 16px; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modalCard {
    background: #fff; border-radius: 20px; padding: 32px 28px;
    max-width: 380px; width: 100%; text-align: center;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15); animation: scaleIn 0.2s ease;
  }
  @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modalEmoji  { font-size: 32px; margin-bottom: 14px; }
  .modalTitle { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: var(--dark-plum); margin-bottom: 8px; }
  .modalDesc { font-size: 12px; color: var(--dusty-rose); line-height: 1.6; margin-bottom: 24px; }
  .modalActions { display: flex; gap: 10px; }
  .modalBtn { flex: 1; min-height: 44px; border-radius: 999px; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: 0.2s ease; }
  .modalBtn.cancel { background: transparent; border: 1px solid rgba(194, 24, 91, 0.2); color: var(--dusty-rose); }
  .modalBtn.cancel:hover { border-color: var(--main-rose); color: var(--main-rose); }
  .modalBtn.confirm { background: #d32f2f; border: none; color: #fff; }
  .modalBtn.confirm:hover { background: #b71c1c; }

  @media (max-width: 640px) {
    .dashGreeting { font-size: 28px; }
    .sitesGrid    { grid-template-columns: 1fr; }
  }
`
