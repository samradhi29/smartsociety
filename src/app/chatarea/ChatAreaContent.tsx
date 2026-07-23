'use client';

import MeetingChat from '@/components/MeetingChat';
import { useSearchParams } from 'next/navigation';

export default function ChatAreaContent() {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meetingId') || '';

  return <MeetingChat meetingId={meetingId} />;
}