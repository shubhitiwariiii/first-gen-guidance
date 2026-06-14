'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, ArrowRight, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    else router.push('/onboarding')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">FirstGen Guidance</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start finding scholarships you actually qualify for</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {['Always free', 'AI-matched scholarships', 'No family roadmap needed'].map(perk => (
            <div key={perk} className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              {perk}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <p className="text-gray-600 text-xs">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account...' : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}