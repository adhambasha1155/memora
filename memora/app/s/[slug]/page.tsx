'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import Loading from '@/app/loading'

export default function SlugRootPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: site } = await supabase
        .from('sites')
        .select('id, template_id, is_published')
        .eq('slug', slug)
        .maybeSingle()

      if (!site) {
        router.replace('/404')
        return
      }

      if (!site.is_published) {
        router.replace(`/s/${slug}/not-published`)
        return
      }

      // Increment view count via RPC
      await supabase.rpc('increment_view_count', { site_id_arg: site.id })

      // Route to correct template
      // template_id 3 = Playful/Birthday
      // Future: other templates will have their own routes
      if (site.template_id === 3) {
        router.replace(`/s/${slug}/invitation`)
      } else {
        // Fallback for other templates (Phase 7)
        router.replace(`/s/${slug}/invitation`)
      }
    }

    load()
  }, [slug])

  return <Loading />
}
