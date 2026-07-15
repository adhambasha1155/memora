import { NextRequest, NextResponse } from 'next/server'
import { deleteFromR2 } from '@/app/lib/r2'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated (server-side client reads the session cookie)
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key } = await req.json()

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    }

    // Make sure the key belongs to this user — same check as presign
    if (!key.startsWith(`users/${user.id}/`)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 403 })
    }

    await deleteFromR2(key)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
