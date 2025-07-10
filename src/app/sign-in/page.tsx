'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      identifier,
      password,
      redirect: true,
      callbackUrl: '/dashboard',
    });
    router.push('/dashboard');
  };

  const handleRegister = () => {
    router.push('/userregister');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-black text-white border border-slate-600 shadow-cyan-300 rounded-4xl ">
        <CardHeader>
          <CardTitle className="text-center rounded-4xl text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-500  bg-clip-text text-transparent">
            Login to Socitopia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-black border border-slate-600 text-white placeholder-gray-400 shadow-blue-50"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-slate-600 text-white placeholder-gray-400  shadow-blue-50" 
            />

            <Button
              onClick={handleLogin}
              className="w-full bg-black text-white font-semibold border border-yellow-300 hover:bg-white hover:text-black transition duration-300"
            >
              Login
            </Button>

            <Button
              variant="ghost"
              onClick={handleRegister}
              className="w-full text-yellow-400 hover:text-yellow-300 transition"
            >
              New user? Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
