'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfileEditForm({ profile, userId }: { profile: any, userId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    state: profile.state || '',
    city: profile.city || '',
    language: profile.language || 'en',
    class_level: profile.class_level || '',
    stream: profile.stream || '',
    family_income: profile.family_income || '',
    is_first_gen: profile.is_first_gen ?? true,
  })

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', userId)

    if (error) setError(error.message)
    else setSuccess(true)
    setSaving(false)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-5">

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-400 rounded-lg p-3 text-sm">
          ✅ Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-400 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-800 pb-2">
          Personal Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">Full Name</label>
            <input
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">Phone</label>
            <input
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 text-xs">Preferred Language</label>
          <select
            value={form.language}
            onChange={e => update('language', e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-800 pb-2">
          Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">State</label>
            <input
              value={form.state}
              onChange={e => update('state', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">City</label>
            <input
              value={form.city}
              onChange={e => update('city', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-800 pb-2">
          Academic Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">Class Level</label>
            <select
              value={form.class_level}
              onChange={e => update('class_level', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
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
          </div>
          <div className="space-y-1">
            <label className="text-gray-400 text-xs">Stream</label>
            <select
              value={form.stream}
              onChange={e => update('stream', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
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
        </div>
      </div>

      {/* Background */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-800 pb-2">
          Family Background
        </h2>
        <div className="space-y-1">
          <label className="text-gray-400 text-xs">Annual Family Income</label>
          <select
            value={form.family_income}
            onChange={e => update('family_income', e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="">Select income range</option>
            <option value="below 1L">Below ₹1 Lakh</option>
            <option value="1-3L">₹1 – 3 Lakh</option>
            <option value="3-6L">₹3 – 6 Lakh</option>
            <option value="6-10L">₹6 – 10 Lakh</option>
            <option value="above 10L">Above ₹10 Lakh</option>
          </select>
        </div>
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
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-colors"
      >
        Back to Dashboard
      </button>

    </div>
  )
}