'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import Link from 'next/link'
import Loading from '@/app/loading'
import imageCompression from 'browser-image-compression'

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string
  file: File
  preview: string
  r2Url?: string
  uploading: boolean
  error?: string
  title?: string
  date?: string
  caption?: string
}

interface FormData {
  slug: string
  recipientName: string
  occasion: string
  senderName: string
  message: string
  date: string
  musicUrl: string
  giftMessage: string
  giftSubtitle: string
  inviteHeading: string
  inviteSubtitle: string
  inviteCountdownLabel: string
  inviteButtonText: string
}

const TEMPLATE_NAMES: Record<number, string> = {
  1: 'Cinematic',
  2: 'Romantic',
  3: 'Playful',
  4: 'Elegant',
  5: 'Minimal',
}

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Graduation',
  'Wedding',
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  'Other',
]

const TABS = [
  { id: 0, label: 'Info', icon: '✦' },
  { id: 1, label: 'Journey', icon: '♥' },
  { id: 2, label: 'Gallery', icon: '🖼' },
  { id: 3, label: 'Message', icon: '✉' },
  { id: 4, label: 'Music', icon: '♪' },
]

// ─── Upload to R2 (with compression) ─────────────────────────────────────────
async function uploadFileToR2(
  file: File,
  userId: string,
  siteSlug: string
): Promise<string> {
  // Compress images before upload
  let fileToUpload: File = file
  if (file.type.startsWith('image/')) {
    fileToUpload = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    })
  }

  const ext =
    fileToUpload.type === 'image/webp' ? 'webp' : file.name.split('.').pop()
  const key = `users/${userId}/sites/${siteSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const res = await fetch('/api/r2/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, contentType: fileToUpload.type }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')
  const { presignedUrl, publicUrl } = await res.json()
  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    body: fileToUpload,
    headers: { 'Content-Type': fileToUpload.type },
  })
  if (!uploadRes.ok) throw new Error('Upload failed')
  return publicUrl
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const siteId = params.siteId as string

  const [userId, setUserId] = useState<string | null>(null)
  const [templateId, setTemplateId] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [slugError, setSlugError] = useState('')
  const [journeyPhotos, setJourneyPhotos] = useState<UploadedFile[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<UploadedFile[]>([])

  const journeyInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    slug: '',
    recipientName: '',
    occasion: OCCASIONS[0],
    senderName: '',
    message: '',
    date: '',
    musicUrl: '',
    giftMessage: '',
    giftSubtitle: '',
    inviteHeading: '',
    inviteSubtitle: '',
    inviteCountdownLabel: '',
    inviteButtonText: '',
  })

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signup')
        return
      }
      setUserId(user.id)

      const { data: site } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!site) {
        router.push('/dashboard')
        return
      }

      setTemplateId(site.template_id)
      setForm({
        slug: site.slug || '',
        recipientName: site.recipient_name || '',
        occasion: site.occasion || OCCASIONS[0],
        senderName: site.sender_name || '',
        message: site.message || '',
        date: site.date || '',
        musicUrl: site.music_url || '',
        giftMessage: site.gift_message || '',
        giftSubtitle: site.gift_subtitle || '',
        inviteHeading: site.invite_heading || '',
        inviteSubtitle: site.invite_subtitle || '',
        inviteCountdownLabel: site.invite_countdown_label || '',
        inviteButtonText: site.invite_button_text || '',
      })

      const { data: media } = await supabase
        .from('media')
        .select('*')
        .eq('site_id', siteId)
        .order('order_index', { ascending: true })

      if (media) {
        const journey = media
          .filter((m) => m.file_type === 'journey_photo')
          .map((m) => ({
            id: m.id,
            file: null as unknown as File,
            preview: m.file_url,
            r2Url: m.file_url,
            uploading: false,
            title: m.title || '',
            date: m.date || '',
            caption: m.caption || '',
          }))
        const gallery = media
          .filter((m) => m.file_type === 'gallery_photo')
          .map((m) => ({
            id: m.id,
            file: null as unknown as File,
            preview: m.file_url,
            r2Url: m.file_url,
            uploading: false,
            title: m.title || '',
            caption: m.caption || '',
          }))
        setJourneyPhotos(journey)
        setGalleryPhotos(gallery)
      }

      setLoading(false)
    }
    load()
  }, [siteId])

  function handleSlugChange(val: string) {
    const clean = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
    setForm((f) => ({ ...f, slug: clean }))
    if (clean.length < 3) setSlugError('At least 3 characters')
    else if (clean.length > 50) setSlugError('Max 50 characters')
    else setSlugError('')
  }

  async function handlePhotoAdd(files: FileList, type: 'journey' | 'gallery') {
    if (!userId || !form.slug) return
    const setter = type === 'journey' ? setJourneyPhotos : setGalleryPhotos
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      uploading: true,
    }))
    setter((prev) => [...prev, ...newFiles])
    for (const uf of newFiles) {
      try {
        const r2Url = await uploadFileToR2(
          uf.file,
          userId,
          form.slug || 'draft'
        )
        setter((prev) =>
          prev.map((p) =>
            p.id === uf.id ? { ...p, r2Url, uploading: false } : p
          )
        )
      } catch {
        setter((prev) =>
          prev.map((p) =>
            p.id === uf.id
              ? { ...p, uploading: false, error: 'Upload failed' }
              : p
          )
        )
      }
    }
  }

  function removePhoto(id: string, type: 'journey' | 'gallery') {
    const setter = type === 'journey' ? setJourneyPhotos : setGalleryPhotos
    setter((prev) => {
      const f = prev.find((p) => p.id === id)
      if (f) URL.revokeObjectURL(f.preview)
      return prev.filter((p) => p.id !== id)
    })
  }

  async function handleSave() {
    if (!userId || slugError || !form.slug) return
    setSaving(true)
    try {
      const { error: siteErr } = await supabase
        .from('sites')
        .update({
          slug: form.slug,
          occasion: form.occasion,
          recipient_name: form.recipientName,
          sender_name: form.senderName,
          message: form.message,
          music_url: form.musicUrl || null,
          gift_message: form.giftMessage || null,
          gift_subtitle: form.giftSubtitle || null,
          invite_heading: form.inviteHeading || null,
          invite_subtitle: form.inviteSubtitle || null,
          invite_countdown_label: form.inviteCountdownLabel || null,
          invite_button_text: form.inviteButtonText || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', siteId)
        .eq('user_id', userId)
      if (siteErr) throw siteErr

      const allMedia = [
        ...journeyPhotos
          .filter((p) => p.r2Url)
          .map((p, i) => ({
            site_id: siteId,
            file_url: p.r2Url!,
            file_type: 'journey_photo',
            order_index: i,
            title: p.title || null,
            date: p.date || null,
            caption: p.caption || null,
          })),
        ...galleryPhotos
          .filter((p) => p.r2Url)
          .map((p, i) => ({
            site_id: siteId,
            file_url: p.r2Url!,
            file_type: 'gallery_photo',
            order_index: i,
            title: p.title || null,
            caption: p.caption || null,
          })),
      ]
      await supabase.from('media').delete().eq('site_id', siteId)
      if (allMedia.length > 0) await supabase.from('media').insert(allMedia)

      setSaved(true)
      setShowPreview(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="shell">
      <nav className="topNav">
        <Link href="/dashboard" className="navBack">
          ←
        </Link>
        <div className="navCenter">
          <span className="navTemplate">
            {TEMPLATE_NAMES[templateId]} · Edit
          </span>
        </div>
        <div className="navSpacer" />
      </nav>

      <div className="tabBar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tabIcon">{t.icon}</span>
            <span className="tabLabel">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="layout">
        <div className="formArea">
          {activeTab === 0 && (
            <div className="section">
              <h2 className="sectionTitle">Basic Info</h2>
              <p className="sectionDesc">
                The essentials for your memory site.
              </p>

              <div className="field">
                <label className="fieldLabel">Recipient&apos;s name</label>
                <input
                  className="fieldInput"
                  placeholder="e.g. Aria"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, recipientName: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="fieldLabel">Your name</label>
                <input
                  className="fieldInput"
                  placeholder="e.g. Sara"
                  value={form.senderName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, senderName: e.target.value }))
                  }
                />
              </div>
              <div className="twoCol">
                <div className="field">
                  <label className="fieldLabel">Occasion</label>
                  <select
                    className="fieldInput"
                    value={form.occasion}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, occasion: e.target.value }))
                    }
                  >
                    {OCCASIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="fieldLabel">Date</label>
                  <input
                    className="fieldInput"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label className="fieldLabel">Site URL slug</label>
                <div className="slugWrap">
                  <span className="slugPrefix">memora.com/</span>
                  <input
                    className={`fieldInput slugInput ${slugError ? 'error' : ''}`}
                    placeholder="birthday-aria"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                  />
                </div>
                {slugError && <span className="fieldError">{slugError}</span>}
                {form.slug && !slugError && (
                  <span className="fieldSuccess">✓ memora.com/{form.slug}</span>
                )}
              </div>

              <div className="divider" />
              <h3 className="subTitle">Invitation Page Text</h3>

              <div className="field">
                <label className="fieldLabel">Main heading</label>
                <input
                  className="fieldInput"
                  placeholder={`e.g. Happy Birthday ${form.recipientName || 'Aria'}!`}
                  value={form.inviteHeading}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inviteHeading: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="fieldLabel">Subtitle</label>
                <textarea
                  className="fieldTextarea"
                  rows={2}
                  placeholder="e.g. Join us for a magical celebration..."
                  value={form.inviteSubtitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inviteSubtitle: e.target.value }))
                  }
                />
              </div>
              <div className="twoCol">
                <div className="field">
                  <label className="fieldLabel">Countdown label</label>
                  <input
                    className="fieldInput"
                    placeholder="e.g. The Magic Begins In..."
                    value={form.inviteCountdownLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inviteCountdownLabel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label className="fieldLabel">Button text</label>
                  <input
                    className="fieldInput"
                    placeholder="e.g. Enter the Magic"
                    value={form.inviteButtonText}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inviteButtonText: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="section">
              <h2 className="sectionTitle">Journey</h2>
              <p className="sectionDesc">
                Add milestones — each with a photo, date and title.
              </p>
              {!form.slug && (
                <div className="uploadWarning">
                  Set a site slug in Basic Info first.
                </div>
              )}
              <div className="milestoneList">
                {journeyPhotos.map((p, i) => (
                  <div key={p.id} className="milestoneItem">
                    <div className="milestonePhotoWrap">
                      <img src={p.preview} alt="" className="milestoneThumb" />
                      {p.uploading && (
                        <div className="photoOverlay">
                          <div className="spinner" />
                        </div>
                      )}
                      {p.error && (
                        <div className="photoOverlay photoError">!</div>
                      )}
                      {p.r2Url && <div className="photoCheck">✓</div>}
                      <button
                        className="photoRemove"
                        onClick={() => removePhoto(p.id, 'journey')}
                      >
                        ×
                      </button>
                      <div className="photoIndex">{i + 1}</div>
                    </div>
                    <div className="milestoneFields">
                      <input
                        className="milestoneInput"
                        placeholder="Title  e.g. The Day We Met"
                        value={p.title || ''}
                        onChange={(e) =>
                          setJourneyPhotos((prev) =>
                            prev.map((x) =>
                              x.id === p.id
                                ? { ...x, title: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                      <input
                        className="milestoneInput"
                        type="date"
                        value={p.date || ''}
                        onChange={(e) =>
                          setJourneyPhotos((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, date: e.target.value } : x
                            )
                          )
                        }
                      />
                      <textarea
                        className="milestoneTextarea"
                        placeholder="Caption..."
                        rows={2}
                        value={p.caption || ''}
                        onChange={(e) =>
                          setJourneyPhotos((prev) =>
                            prev.map((x) =>
                              x.id === p.id
                                ? { ...x, caption: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`addBtn ${!form.slug ? 'disabled' : ''}`}
                onClick={() => form.slug && journeyInputRef.current?.click()}
              >
                + Add milestone
              </button>
              <input
                ref={journeyInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) =>
                  e.target.files && handlePhotoAdd(e.target.files, 'journey')
                }
              />
            </div>
          )}

          {activeTab === 2 && (
            <div className="section">
              <h2 className="sectionTitle">Gallery & Gift</h2>
              <p className="sectionDesc">
                Gallery photos and the gift box message.
              </p>
              {!form.slug && (
                <div className="uploadWarning">
                  Set a site slug in Basic Info first.
                </div>
              )}
              <div className="giftBox">
                <div className="giftBoxHeader">
                  <span>🎁</span>
                  <span className="giftBoxTitle">Gift Box Page</span>
                </div>
                <div className="field">
                  <label className="fieldLabel">Page subtitle</label>
                  <input
                    className="fieldInput"
                    placeholder="e.g. Tap the magical box to reveal your birthday surprise!"
                    value={form.giftSubtitle}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, giftSubtitle: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label className="fieldLabel">Reveal message</label>
                  <textarea
                    className="fieldTextarea"
                    rows={2}
                    placeholder="e.g. A little something made with a whole lot of love 💝"
                    value={form.giftMessage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, giftMessage: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="divider" />
              <h3 className="subTitle">Gallery Photos</h3>
              <div className="milestoneList">
                {galleryPhotos.map((p, i) => (
                  <div key={p.id} className="milestoneItem">
                    <div className="milestonePhotoWrap">
                      <img src={p.preview} alt="" className="milestoneThumb" />
                      {p.uploading && (
                        <div className="photoOverlay">
                          <div className="spinner" />
                        </div>
                      )}
                      {p.error && (
                        <div className="photoOverlay photoError">!</div>
                      )}
                      {p.r2Url && <div className="photoCheck">✓</div>}
                      <button
                        className="photoRemove"
                        onClick={() => removePhoto(p.id, 'gallery')}
                      >
                        ×
                      </button>
                      <div className="photoIndex">{i + 1}</div>
                    </div>
                    <div className="milestoneFields">
                      <input
                        className="milestoneInput"
                        placeholder="Title  e.g. The best day"
                        value={p.title || ''}
                        onChange={(e) =>
                          setGalleryPhotos((prev) =>
                            prev.map((x) =>
                              x.id === p.id
                                ? { ...x, title: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                      <textarea
                        className="milestoneTextarea"
                        placeholder="Caption..."
                        rows={3}
                        value={p.caption || ''}
                        onChange={(e) =>
                          setGalleryPhotos((prev) =>
                            prev.map((x) =>
                              x.id === p.id
                                ? { ...x, caption: e.target.value }
                                : x
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`addBtn ${!form.slug ? 'disabled' : ''}`}
                onClick={() => form.slug && galleryInputRef.current?.click()}
              >
                + Add gallery photo
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) =>
                  e.target.files && handlePhotoAdd(e.target.files, 'gallery')
                }
              />
            </div>
          )}

          {activeTab === 3 && (
            <div className="section">
              <h2 className="sectionTitle">Message</h2>
              <p className="sectionDesc">
                A personal letter to {form.recipientName || 'them'} — shown on
                the Wishes page.
              </p>
              <div className="field">
                <textarea
                  className="fieldTextarea"
                  rows={12}
                  placeholder={`Dear ${form.recipientName || 'Aria'},\n\nAs you celebrate another beautiful trip around the sun...`}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
                <span className="charCount">{form.message.length} / 1000</span>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="section">
              <h2 className="sectionTitle">Music</h2>
              <p className="sectionDesc">
                Add background music that plays when someone opens your Memora.
              </p>
              <div className="field">
                <label className="fieldLabel">
                  Music URL <span className="hint">(optional)</span>
                </label>
                <input
                  className="fieldInput"
                  placeholder="https://open.spotify.com/track/..."
                  value={form.musicUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, musicUrl: e.target.value }))
                  }
                />
              </div>
              <div className="musicNote">
                <span>♪</span>
                Supports Spotify, SoundCloud or direct MP3 links. Music plays
                automatically on the invitation page.
              </div>
            </div>
          )}

          <div className="bottomNav">
            {activeTab > 0 && (
              <button
                className="bottomNavBtn prev"
                onClick={() => setActiveTab((t) => t - 1)}
              >
                ← Prev
              </button>
            )}
            {activeTab < TABS.length - 1 ? (
              <button
                className="bottomNavBtn next"
                onClick={() => setActiveTab((t) => t + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className={`bottomNavBtn save ${saving ? 'loading' : ''} ${saved ? 'saved' : ''}`}
                onClick={handleSave}
                disabled={saving || !form.slug || !!slugError}
              >
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save & Preview →'}
              </button>
            )}
          </div>
        </div>

        <aside className="desktopPreview">
          <div className="previewHeader">
            <span className="previewTitle">Preview</span>
            {showPreview && (
              <span className="previewLocked">🔒 Publish to unlock</span>
            )}
          </div>
          {!showPreview ? (
            <div className="previewEmpty">
              <div className="previewEmptyIcon">✦</div>
              <p className="previewEmptyTitle">Preview appears after saving</p>
              <p className="previewEmptyDesc">
                Fill in the details and hit Save & Preview to see a protected
                preview.
              </p>
            </div>
          ) : (
            <PreviewCards
              form={form}
              journeyPhotos={journeyPhotos}
              galleryPhotos={galleryPhotos}
              router={router}
            />
          )}
        </aside>
      </div>

      <div className="mobileSaveBar">
        <button
          className={`mobileSaveBtn ${saving ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving || !form.slug || !!slugError}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save & Preview'}
        </button>
      </div>

      {showPreview && (
        <div className="bottomSheet">
          <div
            className="bottomSheetHandle"
            onClick={() => setShowPreview(false)}
          />
          <div className="bottomSheetHeader">
            <span className="previewTitle">Preview</span>
            <span className="previewLocked">
              🔒 Publish to unlock full view
            </span>
            <button
              className="sheetClose"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
          </div>
          <div className="bottomSheetContent">
            <PreviewCards
              form={form}
              journeyPhotos={journeyPhotos}
              galleryPhotos={galleryPhotos}
              router={router}
            />
          </div>
        </div>
      )}
      {showPreview && (
        <div className="sheetOverlay" onClick={() => setShowPreview(false)} />
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .shell {
          --warm-white: #fdf5f7;
          --rose-blush: #f9e4ec;
          --main-rose: #c2185b;
          --rose-dark: #7a1733;
          --dark-plum: #2c1a20;
          --dusty-rose: #8a6470;
          --border: rgba(194, 24, 91, 0.1);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background: var(--warm-white);
          display: flex;
          flex-direction: column;
        }
        .topNav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(253, 245, 247, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .navBack {
          font-size: 12px;
          color: var(--dusty-rose);
          text-decoration: none;
          font-weight: 500;
          padding: 6px 0;
        }
        .navCenter {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--main-rose);
        }
        .navSpacer {
          width: 60px;
        }
        .tabBar {
          position: fixed;
          top: 52px;
          left: 0;
          right: 0;
          z-index: 99;
          display: flex;
          background: #fff;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabBar::-webkit-scrollbar {
          display: none;
        }
        .tab {
          flex: 1;
          min-width: 60px;
          padding: 10px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .tab.active {
          border-bottom-color: var(--main-rose);
          background: rgba(194, 24, 91, 0.03);
        }
        .tabIcon {
          font-size: 13px;
        }
        .tabLabel {
          font-size: 9px;
          font-weight: 600;
          color: var(--dusty-rose);
          letter-spacing: 0.04em;
        }
        .tab.active .tabLabel {
          color: var(--main-rose);
        }
        .layout {
          margin-top: 104px;
          flex: 1;
          display: flex;
        }
        .formArea {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px 140px;
        }
        @media (min-width: 900px) {
          .formArea {
            max-width: 480px;
            padding: 28px 28px 80px;
            border-right: 1px solid var(--border);
          }
        }
        .section {
          animation: fadeUp 0.25s ease forwards;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .sectionTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 4px;
        }
        .sectionDesc {
          font-size: 12px;
          color: var(--dusty-rose);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .subTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--dark-plum);
          margin-bottom: 14px;
        }
        .divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }
        .twoCol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .field {
          margin-bottom: 14px;
        }
        .fieldLabel {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: var(--dark-plum);
          margin-bottom: 5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hint {
          font-weight: 400;
          color: var(--dusty-rose);
          text-transform: none;
          font-size: 10px;
        }
        .fieldInput,
        .fieldTextarea {
          width: 100%;
          padding: 10px 13px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .fieldInput:focus,
        .fieldTextarea:focus {
          border-color: var(--main-rose);
          box-shadow: 0 0 0 3px rgba(194, 24, 91, 0.07);
        }
        .fieldInput.error {
          border-color: #d32f2f;
        }
        .fieldError {
          font-size: 10px;
          color: #d32f2f;
          margin-top: 3px;
          display: block;
        }
        .fieldSuccess {
          font-size: 10px;
          color: #2e7d32;
          margin-top: 3px;
          display: block;
          font-weight: 600;
        }
        .fieldTextarea {
          resize: vertical;
          line-height: 1.6;
        }
        .charCount {
          font-size: 10px;
          color: var(--dusty-rose);
          float: right;
          margin-top: 3px;
        }
        .slugWrap {
          display: flex;
        }
        .slugPrefix {
          padding: 10px 10px 10px 13px;
          background: var(--rose-blush);
          border: 1.5px solid var(--border);
          border-right: none;
          border-radius: 10px 0 0 10px;
          font-size: 11px;
          color: var(--dusty-rose);
          white-space: nowrap;
          line-height: 1.4;
        }
        .slugInput {
          border-radius: 0 10px 10px 0 !important;
        }
        .uploadWarning {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 11px;
          color: #7a5800;
          margin-bottom: 16px;
        }
        .milestoneList {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }
        .milestoneItem {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 12px;
          background: var(--warm-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px;
        }
        .milestonePhotoWrap {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--rose-blush);
        }
        .milestoneThumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photoOverlay {
          position: absolute;
          inset: 0;
          background: rgba(44, 26, 32, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photoError {
          background: rgba(211, 47, 47, 0.6);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
        .photoCheck {
          position: absolute;
          bottom: 3px;
          right: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2e7d32;
          color: #fff;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photoRemove {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(44, 26, 32, 0.7);
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .photoIndex {
          position: absolute;
          bottom: 3px;
          left: 3px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(44, 26, 32, 0.6);
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .milestoneFields {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .milestoneInput {
          width: 100%;
          padding: 7px 10px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .milestoneInput:focus {
          border-color: var(--main-rose);
        }
        .milestoneTextarea {
          width: 100%;
          padding: 7px 10px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          color: var(--dark-plum);
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
          line-height: 1.5;
          box-sizing: border-box;
        }
        .milestoneTextarea:focus {
          border-color: var(--main-rose);
        }
        .addBtn {
          width: 100%;
          padding: 11px;
          border: 1.5px dashed rgba(194, 24, 91, 0.25);
          border-radius: 12px;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--main-rose);
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .addBtn:hover:not(.disabled) {
          background: var(--rose-blush);
          border-color: var(--main-rose);
        }
        .addBtn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .giftBox {
          background: rgba(255, 223, 132, 0.12);
          border: 1px solid rgba(255, 223, 132, 0.4);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 4px;
        }
        .giftBoxHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .giftBoxTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--dark-plum);
        }
        .musicNote {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: var(--rose-blush);
          border-radius: 10px;
          font-size: 12px;
          color: var(--dusty-rose);
          line-height: 1.5;
        }
        .bottomNav {
          display: flex;
          gap: 10px;
          margin-top: 28px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .bottomNavBtn {
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .bottomNavBtn.prev {
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--dusty-rose);
        }
        .bottomNavBtn.prev:hover {
          border-color: var(--main-rose);
          color: var(--main-rose);
        }
        .bottomNavBtn.next,
        .bottomNavBtn.save {
          background: var(--main-rose);
          color: #fff;
          margin-left: auto;
          box-shadow: 0 4px 12px rgba(194, 24, 91, 0.2);
        }
        .bottomNavBtn.next:hover,
        .bottomNavBtn.save:hover {
          background: var(--rose-dark);
        }
        .bottomNavBtn.save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bottomNavBtn.saved {
          background: #2e7d32;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .desktopPreview {
          display: none;
        }
        @media (min-width: 900px) {
          .desktopPreview {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 28px;
            background:
              radial-gradient(
                circle at 20% 20%,
                rgba(249, 228, 236, 0.5),
                transparent 40%
              ),
              var(--warm-white);
          }
        }
        .previewHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .previewTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--dark-plum);
        }
        .previewLocked {
          font-size: 10px;
          color: var(--main-rose);
          font-weight: 600;
          background: var(--rose-blush);
          padding: 3px 8px;
          border-radius: 999px;
        }
        .previewEmpty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          opacity: 0.6;
        }
        .previewEmptyIcon {
          font-size: 32px;
          color: rgba(194, 24, 91, 0.2);
        }
        .previewEmptyTitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--dark-plum);
        }
        .previewEmptyDesc {
          font-size: 12px;
          color: var(--dusty-rose);
          max-width: 240px;
          line-height: 1.5;
        }
        .mobileSaveBar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 98;
          padding: 12px 16px;
          background: rgba(253, 245, 247, 0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
        }
        @media (min-width: 900px) {
          .mobileSaveBar {
            display: none;
          }
        }
        .mobileSaveBtn {
          width: 100%;
          padding: 13px;
          background: var(--main-rose);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 6px 18px rgba(194, 24, 91, 0.25);
        }
        .mobileSaveBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .mobileSaveBtn.saved {
          background: #2e7d32;
        }
        .sheetOverlay {
          position: fixed;
          inset: 0;
          background: rgba(44, 26, 32, 0.4);
          z-index: 199;
          backdrop-filter: blur(4px);
        }
        .bottomSheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: #fff;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -20px 60px rgba(44, 26, 32, 0.15);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .bottomSheetHandle {
          width: 40px;
          height: 4px;
          background: rgba(194, 24, 91, 0.15);
          border-radius: 999px;
          margin: 12px auto 0;
          cursor: pointer;
          flex-shrink: 0;
        }
        .bottomSheetHeader {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px 8px;
          flex-shrink: 0;
        }
        .sheetClose {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--rose-blush);
          border: none;
          color: var(--main-rose);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bottomSheetContent {
          overflow-y: auto;
          padding: 8px 20px 32px;
          flex: 1;
        }
      `}</style>
    </div>
  )
}

// ─── Preview Cards Component ──────────────────────────────────────────────────
function PreviewCards({
  form,
  journeyPhotos,
  galleryPhotos,
  router,
}: {
  form: FormData
  journeyPhotos: UploadedFile[]
  galleryPhotos: UploadedFile[]
  router: ReturnType<typeof useRouter>
}) {
  const cards = [
    {
      label: 'Invitation',
      icon: '✦',
      desc:
        form.inviteHeading ||
        `Happy ${form.occasion}${form.recipientName ? `, ${form.recipientName}` : ''}!`,
    },
    {
      label: 'Our Journey',
      icon: '♥',
      desc: `${journeyPhotos.length} photo${journeyPhotos.length !== 1 ? 's' : ''} added`,
    },
    {
      label: 'Gift Box',
      icon: '🎁',
      desc: form.giftSubtitle || 'Tap to open surprise',
    },
    {
      label: 'Wishes',
      icon: '✨',
      desc: form.message
        ? `"${form.message.slice(0, 35)}..."`
        : 'Your message here',
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(194,24,91,0.08)',
              boxShadow: '0 6px 20px rgba(44,26,32,0.07)',
              aspectRatio: '3/4',
              userSelect: 'none',
            }}
          >
            {i === 1 && journeyPhotos[0] && (
              <img
                src={journeyPhotos[0].preview}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(10px) brightness(0.8)',
                  transform: 'scale(1.1)',
                  pointerEvents: 'none',
                }}
              />
            )}
            {i === 2 && galleryPhotos[0] && (
              <img
                src={galleryPhotos[0].preview}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(10px) brightness(0.8)',
                  transform: 'scale(1.1)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gridTemplateRows: 'repeat(4,1fr)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {Array.from({ length: 12 }).map((_, wi) => (
                <span
                  key={wi}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    fontWeight: 800,
                    color: 'rgba(194,24,91,0.15)',
                    letterSpacing: '0.12em',
                    transform: 'rotate(-30deg)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MEMORA
                </span>
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                zIndex: 3,
                padding: 12,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 20 }}>{card.icon}</span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#2c1a20',
                }}
              >
                {card.label}
              </span>
              <span style={{ fontSize: 9, color: '#8a6470', lineHeight: 1.4 }}>
                {card.desc}
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: 12,
                opacity: 0.4,
                zIndex: 4,
              }}
            >
              🔒
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: '#7a1733',
          borderRadius: 16,
          padding: '20px 16px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            color: '#fff',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Ready to share your Memora?
        </p>
        <button
          onClick={() => router.push(`/s/${form.slug}`)}
          style={{
            padding: '10px 24px',
            background: '#fff',
            color: '#7a1733',
            border: 'none',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.04)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Publish & Share →
        </button>
        <p
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}
        >
          Publishing unlocks the full experience.
        </p>
      </div>
    </div>
  )
}
