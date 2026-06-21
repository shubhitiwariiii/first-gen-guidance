'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { GraduationCap, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleReset() {
    if (!email) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">

        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">FirstGen Guidance</span>
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-white">Reset your password</h1>
              <p className="text-gray-500 text-sm mt-1 mb-6">Enter your email and we'll send you a reset link</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 text-xs font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleReset}
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : (<>Send reset link <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-white font-bold text-lg">Check your email</h2>
              <p className="text-gray-500 text-sm mt-1.5">We sent a password reset link to<br /><span className="text-gray-300">{email}</span></p>
            </div>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mt-5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>

      </div>
    </div>
  )
}