import { createClient } from '@/app/lib/supabase'

export interface MediaItem {
  id: string
  file_url: string
  file_type: string
  order_index: number
  title: string | null
  date: string | null
  caption: string | null
}

export interface SiteData {
  id: string
  slug: string
  template_id: number
  occasion: string | null
  recipient_name: string | null
  sender_name: string | null
  message: string | null
  music_url: string | null
  is_published: boolean
  view_count: number
  date: string | null
  bg_color: string | null
  text_color: string | null
  accent_color: string | null
  invite_heading: string | null
  invite_subtitle: string | null
  invite_countdown_label: string | null
  invite_button_text: string | null
  gift_subtitle: string | null
  gift_message: string | null
  created_at: string
  updated_at: string
}

export interface SiteWithMedia {
  site: SiteData
  media: MediaItem[]
}

export async function getSiteBySlug(
  slug: string
): Promise<SiteWithMedia | null> {
  const supabase = createClient()

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !site) return null

  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('site_id', site.id)
    .order('order_index', { ascending: true })

  return {
    site: site as SiteData,
    media: (media ?? []) as MediaItem[],
  }
}
