'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb } from 'lucide-react'

const AVATAR_COLORS = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
]

export default function ShareMentorTip({ userId, profile }: { userId: string, profile: any }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    mentor_name: profile.full_name || '',
    mentor_college: '',
    question: '',
    answer: '',
  })

  async function handleSubmit() {
    if (!form.mentor_college || !form.question || !form.answer) return
    setSaving(true)
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    const { error } = await supabase.from('mentor_tips').insert({
      mentor_user_id: userId,
      mentor_name: form.mentor_name,
      mentor_college: form.mentor_college,
      mentor_avatar_color: color,
      stream: profile.stream,
      state: profile.state,
      question: form.question,
      answer: form.answer,
    })
    if (!error) {
      setSuccess(true)
      setForm({ mentor_name: profile.full_name || '', mentor_college: '', question: '', answer: '' })
      setOpen(false)
    }
    setSaving(false)
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Share a Tip</h3>
            <p className="text-gray-500 text-xs">Help other first-gen students with your experience</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-xl font-semibold transition-all"
        >
          {open ? 'Cancel' : 'Add Tip'}
        </button>
      </div>

      {open && (
        <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-4">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl">
              🎉 Your tip is now live for other students!
            </div>
          )}
          <input
            placeholder="Your Name"
            value={form.mentor_name}
            onChange={e => setForm(f => ({ ...f, mentor_name: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <input
            placeholder="College / Institution"
            value={form.mentor_college}
            onChange={e => setForm(f => ({ ...f, mentor_college: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <input
            placeholder="A common question (e.g. 'How do I afford coaching?')"
            value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
          />
          <textarea
            placeholder="Your answer / advice"
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Submit Tip'}
          </button>
        </div>
      )}
    </div>
  )
}