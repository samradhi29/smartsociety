'use client';

import React, { useState, ChangeEvent, FormEvent , useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Home, Info, Phone, UserCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface FormData {
  name: string;
  flat: string;
  purpose: string;
  email: string;
  info: string;
  gender: string;
societyname : string;

}

export default function VisitorEntryForm() {
  const [formdata, setFormdata] = useState<FormData>({
    name: '',
    flat: '',
    purpose: '',
    email: '',
    info: '',
    gender: '',
    societyname:''
  
  });
const { data: session, status } = useSession();
  const [OTP, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
useEffect(() => {
    if (session?.user?.society) {
      setFormdata((prev) => ({
        ...prev,
        societyname: session.user.society,
      }));
    }
  }, [session]);



  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

  const askforotp = async (email: string) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    const otp = generateOtp();
    try {
      const res = await fetch('/api/otpsend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        alert('OTP sent to your email.');
      } else {
        alert(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('OTP send error:', err);
      alert('Error while sending OTP.');
    }
  };

  const handleverify = async () => {
    if (!OTP || OTP.length !== 6) {
      alert('Enter a valid 6-digit OTP.');
      return;
    }

    try {
      const res = await fetch('/api/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formdata.email, otp: OTP }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        alert('OTP Verified!');
      } else {
        alert(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      console.error(err);
      alert('Verification failed.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formdata.name || !formdata.purpose) {
      alert('Name and Purpose are required.');
      return;
    }

    if (!otpVerified) {
      alert('Please verify OTP before submitting.');
      return;
    }

    try {
      const res = await fetch('/api/visitorlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata ),
      });

      const data = await res.json();
      alert(data.message || 'Visitor entry recorded.');

      setFormdata({
        name: '',
        flat: '',
        purpose: '',
        email: '',
        info: '',
        gender: '',
        societyname : ''
      
      });
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-cyan-900 via-black to-gray-900 text-white">
      {/* Left Side */}
      <div className="md:w-1/2 relative overflow-hidden rounded-l-xl">
        <img
          src="https://images.unsplash.com/photo-1560184897-fd1ed41e6e88?auto=format&fit=crop&w=800&q=80"
          alt="Residential Flats"
          className="object-cover w-full h-full brightness-75"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-10">
          <h3 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Welcome to Your Residential Society
          </h3>
          <p className="text-lg max-w-md text-white drop-shadow-md">
            Visitors can register securely before entry. Our system helps maintain safety and
            smooth access to your community.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 p-10 flex justify-center items-center">
        <Card className="w-full max-w-lg bg-black/80 rounded-xl shadow-2xl shadow-cyan-600">
          <CardContent className="p-10 space-y-6">
            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">Visitor Entry</h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-white">
              {/* Name */}
              <div className="relative">
                <User className="absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  name="name"
                  placeholder="Visitor's Name"
                  value={formdata.name}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-black/60 placeholder:text-gray-400"
                />
              </div>

              {/* Flat */}
              <div className="relative">
                <Home className="absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  name="flat"
                  placeholder="Flat No (optional)"
                  value={formdata.flat}
                  onChange={handleChange}
                  className="pl-10 bg-black/60 placeholder:text-gray-400"
                />
              </div>

              {/* Purpose */}
              <div className="relative">
                <UserCheck className="absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  name="purpose"
                  placeholder="Purpose of Visit"
                  value={formdata.purpose}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-black/60 placeholder:text-gray-400"
                />
              </div>

              {/* Additional Info */}
              <div className="relative">
                <Info className="absolute top-3 left-3" />
                <textarea
                  name="info"
                  placeholder="Additional Information"
                  value={formdata.info}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 pl-10 rounded-md bg-black/60 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Gender */}
              <select
                name="gender"
                value={formdata.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-black/60 text-white placeholder-gray-400"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* Email */}
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  name="email"
                  placeholder="Email Address"
                  value={formdata.email}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-black/60 placeholder:text-gray-400"
                />
              </div>

              {/* OTP Section */}
              {!otpSent && (
                <Button
                  type="button"
                  onClick={() => askforotp(formdata.email)}
                  className="w-full bg-gradient-to-r from-cyan-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800"
                >
                  Get OTP
                </Button>
              )}

              {otpSent && !otpVerified && (
                <div className="space-y-3">
                  <Input
                    type="number"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={OTP}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-black/60 placeholder:text-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={handleverify}
                    className="w-full bg-gradient-to-r from-cyan-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800"
                  >
                    Verify OTP
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!otpVerified}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-700 hover:from-green-600 hover:to-cyan-800 disabled:opacity-50"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
