// app/api/visitorlogin/route.ts
import { NextResponse } from 'next/server'
import { dbconnect } from '@/app/lib/dbconnect'
import { visitorModel } from '@/model/Visitors'

export async function POST(req: Request) {
  await dbconnect()

  try {
    const { name, flat, purpose, contactno, info, gender  , societyname} = await req.json()

    if (!name || !purpose) {
      return NextResponse.json(
        { message: 'Name and purpose are required' },
        { status: 400 }
      )
    }

    const newVisitor = new visitorModel({
      name,
      flatno: flat,
      purpose,
      contactno,
      info,
      gender,
      entrytime: new Date(),
      societyname
    })

    await newVisitor.save()

    return NextResponse.json(
      { message: 'Visitor registered successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Server Error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
