'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Calendar, Clock } from 'lucide-react'

interface Deadline {
  id: string
  title: string
  description: string
  due_date: string
  category: string
  is_done: boolean
}

export default function DeadlineTracker({ userId }: { userId: string }) {
  const supabase = createClient()
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', due_date: '', category: 'scholarship' })

  useEffect(() => { fetchDeadlines() }, [])

  async function fetchDeadlines() {
    const { data } = await supabase.from('deadlines').select('*').eq('user_id', userId).order('due_date', { ascending: true })
    setDeadlines(data || [])
    setLoading(false)
  }

  async function addDeadline() {
    if (!form.title || !form.due_date) return
    await supabase.from('deadlines').insert({ user_id: userId, ...form })
    setForm({ title: '', description: '', due_date: '', category: 'scholarship' })
    setAdding(false)
    fetchDeadlines()
  }

  async function toggleDone(id: string, current: boolean) {
    await supabase.from('deadlines').update({ is_done: !current }).eq('id', id)
    fetchDeadlines()
  }

  async function deleteDeadline(id: string) {
    await supabase.from('deadlines').delete().eq('id', id)
    fetchDeadlines()
  }

  function getDaysLeft(due_date: string) {
    return Math.ceil((new Date(due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  function getDaysStyle(days: number, done: boolean) {
    if (done) return 'text-gray-600 bg-gray-500/10'
    if (days < 0) return 'text-gray-500 bg-gray-500/10'
    if (days <= 3) return 'text-red-400 bg-red-500/10'
    if (days <= 7) return 'text-yellow-400 bg-yellow-500/10'
    return 'text-emerald-400 bg-emerald-500/10'
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Deadlines</h2>
            <p className="text-gray-500 text-xs">{deadlines.filter(d => !d.is_done).length} upcoming</p>
          </div>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="px-5 py-4 border-b border-white/5 space-y-2.5">
          <input
            placeholder="Deadline title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="scholarship">Scholarship</option>
              <option value="college">College</option>
              <option value="exam">Exam</option>
              <option value="document">Document</option>
            </select>
          </div>
          <button
            onClick={addDeadline}
            className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Add Deadline
          </button>
        </div>
      )}

      {/* List */}
      <div className="p-4 space-y-2">
        {loading && [1,2].map(i => <div key={i} className="h-14 bg-white/3 rounded-xl animate-pulse" />)}

        {!loading && deadlines.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-600 text-xs">No deadlines yet</p>
          </div>
        )}

        {!loading && deadlines.map(d => {
          const daysLeft = getDaysLeft(d.due_date)
          return (
            <div key={d.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${d.is_done ? 'bg-white/1 border-white/3 opacity-50' : 'bg-white/3 border-white/5 hover:bg-white/5'}`}>
              <input
                type="checkbox"
                checked={d.is_done}
                onChange={() => toggleDone(d.id, d.is_done)}
                className="w-3.5 h-3.5 accent-violet-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${d.is_done ? 'line-through text-gray-600' : 'text-white'}`}>
                  {d.title}
                </p>
                <span className="text-gray-600 text-xs">{d.category}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDaysStyle(daysLeft, d.is_done)}`}>
                  {d.is_done ? 'Done' : daysLeft < 0 ? 'Expired' : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                </span>
                <button
                  onClick={() => deleteDeadline(d.id)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}