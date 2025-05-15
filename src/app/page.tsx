"use client"
import { User, LogIn } from 'lucide-react';
 // Import icons from Lucide
import Link from 'next/link';
import { motion } from 'framer-motion';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-purple-900 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4">
        <img src="/logo.png" alt="Socitopia Logo" className="w-16 h-16" />
<h1 className="text-4xl font-semibold bg-gradient-to-r from-purple-900 to-white bg-clip-text text-transparent drop-shadow-lg  italic mr-30">
  Welcome to Socitopia
</h1>

      </div>

      {/* Main Content Section */}
      <div className="flex justify-between mt-10">
        {/* Text Section */}
     <div className="text-purple-200 ml-45 mt-30 max-w-lg">
      <motion.h1
        className="text-purple-400 text-7xl font-stretch-normal"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        Connect
      </motion.h1>

      <motion.h2
        className="text-4xl mask-radial-from-neutral-950 text-purple-300"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Organize
      </motion.h2>

      <motion.h3
        className="text-2xl mask-radial-from-neutral-700 text-purple-100"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Manage
      </motion.h3>

      <motion.p
        className="mt-4 text-4xl text-purple-500 mask-radial-from-neutral-500"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Your society
      </motion.p>

      <motion.p
        className="text-3xl text-purple-400 mask-radial-from-neutral-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        With ease
      </motion.p>
    </div>

        {/* Login Area */}
        <div className="mr-10 mt-16">
          <div className="loginbox  bg-black rounded-4xl flex flex-col items-center justify-center space-y-6 p-8 border-2 border-purple-500 shadow-10xl shadow-purple-900 h-100 w-80  mr-40">
            {/* Register Button */}
            <Link href="/registersociety">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-900 to-black text-white font-semibold rounded-lg border-2 border-purple-500 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-3">
                <User className="text-white text-xl" />
                Register Your Society
              </button>
            </Link>

            {/* Login as Resident Button */}
            <Link href="\sign-in">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-900 to-black text-white font-semibold rounded-lg border-2 border-purple-500 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-3">
              <LogIn className="text-white text-xl" />
              Login as Resident
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
