import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/app/lib/r2'
import { createClient } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, contentType } = await req.json()

    if (!key || !contentType) {
      return NextResponse.json({ error: 'Missing key or contentType' }, { status: 400 })
    }

    // Only allow image uploads through this route
    if (!contentType.startsWith('image/') && !contentType.startsWith('video/') && contentType !== 'audio/mpeg') {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Make sure the key belongs to this user
    if (!key.startsWith(`users/${user.id}/`)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 403 })
    }

    const presignedUrl = await getPresignedUploadUrl(key, contentType)
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ presignedUrl, publicUrl })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
