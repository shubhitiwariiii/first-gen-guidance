'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowRight, ArrowLeft, Check } from 'lucide-react'

const STEPS = [
  { title: 'Personal Info', desc: 'Tell us about yourself' },
  { title: 'Location', desc: 'Where are you from?' },
  { title: 'Academic Info', desc: 'Your education details' },
  { title: 'Family Background', desc: 'Help us match better' },
]

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      onboarding_complete: true,
    })

    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
  const selectClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
  const labelClass = "block text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5"

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">FirstGen Guidance</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-blue-600 text-white' :
                i === step ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' :
                'bg-white/5 border border-white/10 text-gray-600'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px transition-all ${i < step ? 'bg-blue-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

          {/* Card header */}
          <div className="px-8 py-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl">{STEPS[step].title}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{STEPS[step].desc}</p>
              </div>
              <span className="text-gray-600 text-sm">{step + 1} / {STEPS.length}</span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form content */}
          <div className="px-8 py-6 space-y-4">

            {/* Step 0: Personal Info */}
            {step === 0 && (
              <>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input placeholder="Shubhi Tiwari" value={form.full_name} onChange={e => update('full_name', e.target.value)} className={inputClass} />
                </div>
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
              </>
            )}

            {/* Step 1: Location */}
            {step === 1 && (
              <>
                <div>
                  <label className={labelClass}>State</label>
                  <input placeholder="Uttar Pradesh" value={form.state} onChange={e => update('state', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input placeholder="Lucknow" value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} />
                </div>
              </>
            )}

            {/* Step 2: Academic */}
            {step === 2 && (
              <>
                <div>
                  <label className={labelClass}>Class Level</label>
                  <select value={form.class_level} onChange={e => update('class_level', e.target.value)} className={selectClass}>
                    <option value="">Select class level</option>
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
                    <option value="">Select stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 3: Background */}
            {step === 3 && (
              <>
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
                <div className="flex items-start gap-3 p-4 bg-white/3 border border-white/8 rounded-xl">
                  <input
                    type="checkbox"
                    id="first_gen"
                    checked={form.is_first_gen}
                    onChange={e => update('is_first_gen', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-blue-500 shrink-0"
                  />
                  <label htmlFor="first_gen" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                    I am the first in my family to pursue higher education
                  </label>
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}