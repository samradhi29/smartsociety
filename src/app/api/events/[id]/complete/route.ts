import { NextRequest, NextResponse } from 'next/server';
import { dbconnect } from '@/app/lib/dbconnect';
import Event from '@/model/Event'; // Adjust if your model path differs

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbconnect();
  try {
    // Await the params Promise before using its properties
    const { id } = await params;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { iscompleted: true },
      { new: true }
    );
    
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Event marked as completed',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Error marking completed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}