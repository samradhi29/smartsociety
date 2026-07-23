'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <button onClick={() => router.push('/AddEvent')} style={{ marginRight: 10 }}>
        Add Event
      </button>
      <button onClick={() => router.push('/FetchEvents')}>
        See All
      </button>
    </>
  );
}
