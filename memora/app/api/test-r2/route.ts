import { NextResponse } from 'next/server'
import { uploadToR2 } from '@/app/lib/r2'

export async function GET() {
  try {
    const testContent = Buffer.from('Hello from Memora R2 test!')
    const url = await uploadToR2('test/hello.txt', testContent, 'text/plain')
    return NextResponse.json({ success: true, url })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
