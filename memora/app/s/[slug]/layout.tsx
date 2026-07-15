'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import { SiteData } from '@/app/lib/getSiteBySlug'
import ConnectedNav from '@/components/ConnectedNav'

// This layout wraps every /s/[slug]/* route (invitation, journey, gift-box,
// wishes, not-published, etc). Next.js keeps layouts mounted while swapping
// child pages during navigation — so ConnectedNav (and the <audio> element
// it owns) survives switching tabs instead of restarting every time.
//
// IMPORTANT: this layout only handles the nav bar + music. It does NOT do
// its own is_published redirect check — each page (root, invitation, journey,
// gift-box, wishes) already does that correctly on its own. Having a second,
// independent check here caused a race/stale-closure bug where this layout
// could redirect to /not-published even when the page's own check had
// already confirmed the site was published.
const NAV_KEYS = ['invitation', 'journey', 'gift-box', 'wishes']

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const slug = params.slug as string

  const [site, setSite] = useState<SiteData | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      setSite(data as SiteData | null)
    }
    load()
  }, [slug])

  const activeKey = pathname.split('/').pop() || ''
  const showNav = site?.is_published && NAV_KEYS.includes(activeKey)

  return (
    <>
      {children}
      {showNav && (
        <ConnectedNav
          active={activeKey}
          basePath={`/s/${slug}`}
          musicUrl={site?.music_url}
          accent={site?.accent_color || '#c2185b'}
        />
      )}
    </>
  )
}
