'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

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

  useEffect(() => { checkIfMentor() }, [])

  async function checkIfMentor() {
    const { data } = await supabase.from('mentors').select('id').eq('user_id', userId).single()
    setIsMentor(!!data)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.college || !form.bio) return
    setSaving(true)
    const { error } = await supabase.from('mentors').insert({ user_id: userId, ...form, is_available: true })
    if (!error) { setIsMentor(true); setOpen(false); setSuccess(true) }
    setSaving(false)
  }

  if (loading) return null

  if (isMentor) return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
        <Star className="w-5 h-5 text-violet-400" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm whitespace-nowrap">You are a Mentor</h3>
        <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">Other students can find and connect with you</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">Active</span>
        <button
          onClick={async () => {
            await supabase.from('mentors').delete().eq('user_id', userId)
            setIsMentor(false)
          }}
          className="text-xs text-gray-500 hover:text-red-400 bg-white/3 hover:bg-red-500/10 border border-white/8 hover:border-red-500/20 px-2.5 py-1 rounded-full transition-all"
        >
          Remove me
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Become a Mentor</h3>
            <p className="text-gray-500 text-xs">Help other first-gen students like you</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-xl font-semibold transition-all"
        >
          {open ? 'Cancel' : 'Register'}
        </button>
      </div>

      {open && (
        <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-4">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl">
              🎉 You are now listed as a mentor!
            </div>
          )}
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <input
            placeholder="College Name"
            value={form.college}
            onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <input
            placeholder="WhatsApp Number"
            value={form.whatsapp}
            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <textarea
            placeholder="Short bio — what can you help with?"
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Submit & Become a Mentor'}
          </button>
        </div>
      )}
    </div>
  )
}