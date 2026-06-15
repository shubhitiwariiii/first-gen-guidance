'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'

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
    const { error } = await supabase.from('profiles').update(form).eq('id', userId)
    if (error) setError(error.message)
    else setSuccess(true)
    setSaving(false)
  }

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
  const selectClass = "w-full px-4 py-3 bg-[#0d0d14] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
  const labelClass = "block text-gray-500 text-xs font-medium mb-1.5"
  const sectionClass = "text-gray-500 text-xs font-medium uppercase tracking-wider border-b border-white/5 pb-2 mb-4"

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl">
          ✅ Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div>
        <h2 className={sectionClass}>Personal Info</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input value={form.full_name} onChange={e => update('full_name', e.target.value)} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} placeholder="Phone number" />
            </div>
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
      <div>
        <h2 className={sectionClass}>Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>State</label>
            <input value={form.state} onChange={e => update('state', e.target.value)} className={inputClass} placeholder="Your state" />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} placeholder="Your city" />
          </div>
        </div>
      </div>

      {/* Academic */}
      <div>
        <h2 className={sectionClass}>Academic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Background */}
      <div>
        <h2 className={sectionClass}>Family Background</h2>
        <div className="space-y-4">
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
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

    </div>
  )
}