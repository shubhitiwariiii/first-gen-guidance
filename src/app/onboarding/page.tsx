'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STEPS = ['Personal Info', 'Location', 'Academic Info', 'Background']

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    state: '',
    city: '',
    language: 'en',
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

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg p-8 space-y-6">

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{STEPS[step]}</span>
            <span>{step + 1} / {STEPS.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Personal Info</h2>
            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <select
              value={form.language}
              onChange={e => update('language', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Location</h2>
            <input
              placeholder="State (e.g. Uttar Pradesh)"
              value={form.state}
              onChange={e => update('state', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={e => update('city', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Academic Info</h2>
            <select
              value={form.class_level}
              onChange={e => update('class_level', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select class level</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="UG Year 1">UG Year 1</option>
              <option value="UG Year 2">UG Year 2</option>
              <option value="UG Year 3">UG Year 3</option>
              <option value="UG Year 4">UG Year 4</option>
            </select>
            <select
              value={form.stream}
              onChange={e => update('stream', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select stream</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {/* Step 3: Background */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Family Background</h2>
            <select
              value={form.family_income}
              onChange={e => update('family_income', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">Annual family income</option>
              <option value="below 1L">Below ₹1 Lakh</option>
              <option value="1-3L">₹1 – 3 Lakh</option>
              <option value="3-6L">₹3 – 6 Lakh</option>
              <option value="6-10L">₹6 – 10 Lakh</option>
              <option value="above 10L">Above ₹10 Lakh</option>
            </select>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <input
                type="checkbox"
                id="first_gen"
                checked={form.is_first_gen}
                onChange={e => update('is_first_gen', e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <label htmlFor="first_gen" className="text-white text-sm">
                I am the first in my family to pursue higher education
              </label>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}