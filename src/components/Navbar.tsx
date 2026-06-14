'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, LogOut, User } from 'lucide-react'

export default function Navbar({ name }: { name: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">FirstGen Guidance</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{name?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-gray-300 text-xs font-medium">{name}</span>
          </div>
          <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs rounded-lg font-medium transition-all">
            <User className="w-3.5 h-3.5" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-300 hover:text-red-400 text-xs rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            {loggingOut ? '...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}