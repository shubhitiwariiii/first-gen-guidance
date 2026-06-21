'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react'

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Other']

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    country: 'India',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSignup() {
    setLoading(true)
    setError('')

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        country: form.country,
      })
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    router.push('/onboarding')
    setLoading(false)
  }

  const inputClass = "w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
  const labelClass = "block text-gray-400 text-xs font-medium mb-1.5"

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">FirstGen Guidance</span>
        </Link>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h1 className="text-xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">Find scholarships you actually qualify for</p>

          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelClass}>First name</label>
                <input
                  placeholder="Shubhi"
                  value={form.first_name}
                  onChange={e => update('first_name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Last name</label>
                <input
                  placeholder="Tiwari"
                  value={form.last_name}
                  onChange={e => update('last_name', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
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

            <div className="space-y-1.5">
              <label className={labelClass}>Country</label>
              <select
                value={form.country}
                onChange={e => update('country', e.target.value)}
                className={inputClass}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}