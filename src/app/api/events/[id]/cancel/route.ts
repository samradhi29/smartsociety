import { NextRequest, NextResponse } from 'next/server';
import { dbconnect } from '@/app/lib/dbconnect';
import Event from '@/model/Event'; // Adjust if your model path differs

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbconnect();
  try {
    // Await the params Promise before using its properties
    const { id } = await params;
    
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Event cancelled successfully',
      data: deletedEvent,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}