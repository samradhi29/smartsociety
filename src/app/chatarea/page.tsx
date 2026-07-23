import { Suspense } from 'react';
import ChatAreaContent from './ChatAreaContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatAreaContent />
    </Suspense>
  );
}