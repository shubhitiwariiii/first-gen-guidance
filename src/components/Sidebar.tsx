'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { GraduationCap, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react'

export default function Sidebar({ name, email }: { name: string, email?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#0d0d14] border border-white/10 rounded-lg flex items-center justify-center"
      >
        <Menu className="w-4 h-4 text-gray-400" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-[220px] bg-[#0d0d14] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">FirstGen</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-600 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-0.5">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wider px-3 mb-3">Navigation</p>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-white bg-white/5 border border-white/8 text-sm">
            <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-400" />
            <span>Dashboard</span>
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
            <User className="w-4 h-4 shrink-0" />
            <span>Edit Profile</span>
          </Link>
        </nav>

        {/* Progress */}
        <div className="px-3">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wider px-3 mb-3">Your Progress</p>
          <div className="space-y-1.5">
            {[
              { label: 'Create profile', done: true, icon: '👤' },
              { label: 'Upload documents', done: false, icon: '📄' },
              { label: 'Find scholarships', done: false, icon: '🎓' },
              { label: 'Add deadlines', done: false, icon: '📅' },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${item.done ? 'bg-blue-500/8 border border-blue-500/15' : 'bg-white/3 border border-white/5'}`}>
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className={`text-xs flex-1 ${item.done ? 'text-blue-300' : 'text-gray-400'}`}>{item.label}</span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-blue-500' : 'bg-white/8 border border-white/10'}`}>
                  {item.done && <span className="text-white text-[9px] font-bold">✓</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-600 text-xs">Setup progress</span>
              <span className="text-blue-400 text-xs font-semibold">25%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
          <div className="mt-2 px-3 py-3 bg-white/3 border border-white/5 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{name}</p>
                <p className="text-gray-600 text-xs truncate">{email || 'Student'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}