'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { GraduationCap, Check, PartyPopper } from 'lucide-react'

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    phone: '',
    language: 'en',
    state: '',
    city: '',
    class_level: '',
    stream: '',
    family_income: '',
    is_first_gen: true,
  })

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (!form.state || !form.class_level || !form.stream || !form.family_income) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      onboarding_complete: true,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2200)
  }

  const inputClass = "w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
  const selectClass = "w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
  const labelClass = "block text-gray-400 text-xs font-medium mb-1.5"
  const sectionLabel = "text-gray-500 text-xs font-semibold uppercase tracking-wide"

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Success modal */}
      {/* {success && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Profile complete!</h2>
            <p className="text-gray-500 text-sm">Taking you to your dashboard...</p>
            <div className="mt-5 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[progress_2.2s_linear]" style={{ animation: 'progressFill 2.2s linear forwards' }} />
            </div>
          </div>
          <style jsx>{`
            @keyframes progressFill {
              from { width: 0% }
              to { width: 100% }
            }
          `}</style>
        </div>
      )} */}

      {success && (
        <div className="fixed inset-0 bg-[#030712] flex flex-col items-center justify-center z-50 px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="text-white font-bold text-2xl mb-2">Profile complete!</h2>
          <p className="text-gray-500 text-sm">Taking you to your dashboard...</p>
          <div className="mt-6 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ animation: 'progressFill 2.2s linear forwards' }} />
          </div>
          <style jsx>{`
      @keyframes progressFill {
        from { width: 0% }
        to { width: 100% }
      }
    `}</style>
        </div>
      )}

      <div className="w-full max-w-lg relative">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">FirstGen Guidance</span>
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-7 py-5 border-b border-white/5">
            <h1 className="text-xl font-bold text-white">Complete your profile</h1>
            <p className="text-gray-500 text-sm mt-1">This helps us match you to the right scholarships</p>
          </div>

          <div className="px-7 py-6 space-y-6">

            {/* Personal */}
            <div className="space-y-3.5">
              <p className={sectionLabel}>Personal</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Preferred Language</label>
                  <select value={form.language} onChange={e => update('language', e.target.value)} className={selectClass}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3.5">
              <p className={sectionLabel}>Location</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>State</label>
                  <input placeholder="Uttar Pradesh" value={form.state} onChange={e => update('state', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input placeholder="Lucknow" value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Academic */}
            <div className="space-y-3.5">
              <p className={sectionLabel}>Academic info</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Class Level</label>
                  <select value={form.class_level} onChange={e => update('class_level', e.target.value)} className={selectClass}>
                    <option value="">Select</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="UG Year 1">UG Year 1</option>
                    <option value="UG Year 2">UG Year 2</option>
                    <option value="UG Year 3">UG Year 3</option>
                    <option value="UG Year 4">UG Year 4</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stream</label>
                  <select value={form.stream} onChange={e => update('stream', e.target.value)} className={selectClass}>
                    <option value="">Select</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Family background */}
            <div className="space-y-3.5">
              <p className={sectionLabel}>Family background</p>
              <div>
                <label className={labelClass}>Annual Family Income</label>
                <select value={form.family_income} onChange={e => update('family_income', e.target.value)} className={selectClass}>
                  <option value="">Select income range</option>
                  <option value="below 1L">Below ₹1 Lakh</option>
                  <option value="1-3L">₹1 – 3 Lakh</option>
                  <option value="3-6L">₹3 – 6 Lakh</option>
                  <option value="6-10L">₹6 – 10 Lakh</option>
                  <option value="above 10L">Above ₹10 Lakh</option>
                </select>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-white/3 border border-white/8 rounded-xl">
                <input
                  type="checkbox"
                  id="first_gen"
                  checked={form.is_first_gen}
                  onChange={e => update('is_first_gen', e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-blue-500 shrink-0"
                />
                <label htmlFor="first_gen" className="text-gray-300 text-xs leading-relaxed cursor-pointer">
                  I am the first in my family to pursue higher education
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : (
                <>Complete Setup <Check className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}