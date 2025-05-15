'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For App Router in Next.js 13

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Make sure useRouter is inside a client-side component

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      identifier,
      password,
      redirect: true,
      callbackUrl: '/',
    });
    router.push('/dashboard');
  };

  const handleRegister = () => {
    router.push('/userregister'); // Corrected: Navigate to the registration page
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>New user? Register</button>
    </div>
  );
}
