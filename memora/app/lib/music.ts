// Shared music-link helpers — used by ConnectedNav (playback UI) and any
// page that needs to know what kind of link was stored in music_url.

export type MusicType = 'direct' | 'spotify' | 'soundcloud' | 'unknown'

export function getMusicType(url: string): MusicType {
  if (/\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(url)) return 'direct'
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('soundcloud.com')) return 'soundcloud'
  return 'unknown'
}

// Converts a normal Spotify link (track/album/playlist, with or without
// an intl-xx locale prefix) into its embeddable form.
export function buildSpotifyEmbedUrl(url: string): string | null {
  const match = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  const [, type, id] = match
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
}

export function buildSoundCloudEmbedUrl(url: string, accent: string): string {
  const color = accent.replace('#', '')
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false&color=%23${color}`
}
