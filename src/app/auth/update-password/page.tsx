'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleUpdate() {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 1800)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[100dvh] bg-[#030712] flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">

        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">FirstGen Guidance</span>
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
          {!done ? (
            <>
              <h1 className="text-xl font-bold text-white">Set a new password</h1>
              <p className="text-gray-500 text-sm mt-1 mb-6">Choose a new password for your account</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 text-xs font-medium">New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleUpdate}
                  disabled={loading || !password}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Updating...' : (<>Update password <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-400" strokeWidth={3} />
              </div>
              <h2 className="text-white font-bold text-lg">Password updated!</h2>
              <p className="text-gray-500 text-sm mt-1.5">Taking you to your dashboard...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}