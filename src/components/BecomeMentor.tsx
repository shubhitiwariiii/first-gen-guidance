'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BecomeMentor({ userId, profile }: { userId: string, profile: any }) {
  const supabase = createClient()
  const [isMentor, setIsMentor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: profile.full_name || '',
    stream: profile.stream || '',
    class_level: profile.class_level || '',
    state: profile.state || '',
    college: '',
    bio: '',
    whatsapp: profile.phone || '',
  })

  useEffect(() => {
    checkIfMentor()
  }, [])

  async function checkIfMentor() {
    const { data } = await supabase
      .from('mentors')
      .select('id')
      .eq('user_id', userId)
      .single()
    setIsMentor(!!data)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.college || !form.bio) return
    setSaving(true)
    const { error } = await supabase.from('mentors').insert({
      user_id: userId,
      ...form,
      is_available: true,
    })
    if (!error) {
      setIsMentor(true)
      setOpen(false)
      setSuccess(true)
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {success && (
        <div className="bg-green-900 border border-green-700 text-green-400 rounded-lg p-3 text-sm mb-4">
          🎉 You are now listed as a mentor! Other students can find and contact you.
        </div>
      )}

      {isMentor ? (
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <h3 className="text-white font-bold">You are a Mentor</h3>
            <p className="text-gray-400 text-sm">Other students can see your profile and reach out.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">Become a Mentor</h3>
              <p className="text-gray-400 text-sm">Help other first-gen students like you</p>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold"
            >
              {open ? 'Cancel' : 'Register'}
            </button>
          </div>

          {open && (
            <div className="mt-4 space-y-3">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <input
                placeholder="College Name"
                value={form.college}
                onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <input
                placeholder="WhatsApp Number"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <textarea
                placeholder="Write a short bio — what can you help with? (e.g. JEE prep, NSP scholarship, hostel life)"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Submit & Become a Mentor'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}