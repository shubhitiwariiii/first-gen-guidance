'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    category: 'scholarship',
  })

  useEffect(() => {
    fetchDeadlines()
  }, [])

  async function fetchDeadlines() {
    const { data } = await supabase
      .from('deadlines')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })
    setDeadlines(data || [])
    setLoading(false)
  }

  async function addDeadline() {
    if (!form.title || !form.due_date) return
    const { error } = await supabase.from('deadlines').insert({
      user_id: userId,
      ...form,
    })
    if (!error) {
      setForm({ title: '', description: '', due_date: '', category: 'scholarship' })
      setAdding(false)
      fetchDeadlines()
    }
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
    const diff = Math.ceil(
      (new Date(due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff
  }

  function getDaysColor(days: number) {
    if (days < 0) return 'text-gray-500'
    if (days <= 3) return 'text-red-400'
    if (days <= 7) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">📅 Deadlines</h2>
          <p className="text-gray-400 text-sm">Track application dates</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
        >
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
          <input
            placeholder="Title (e.g. NSP Scholarship Application)"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="flex-1 p-2 rounded bg-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="flex-1 p-2 rounded bg-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="scholarship">Scholarship</option>
              <option value="college">College</option>
              <option value="exam">Exam</option>
              <option value="document">Document</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            onClick={addDeadline}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
          >
            Save Deadline
          </button>
        </div>
      )}

      {/* Deadlines list */}
      {loading && (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && deadlines.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No deadlines yet. Add one to get started.
        </p>
      )}

      {!loading && deadlines.map(d => {
        const daysLeft = getDaysLeft(d.due_date)
        return (
          <div
            key={d.id}
            className={`bg-gray-800 rounded-lg p-4 border ${d.is_done ? 'border-gray-700 opacity-50' : 'border-gray-700'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={d.is_done}
                  onChange={() => toggleDone(d.id, d.is_done)}
                  className="mt-1 w-4 h-4 accent-blue-500"
                />
                <div>
                  <p className={`text-sm font-semibold ${d.is_done ? 'line-through text-gray-500' : 'text-white'}`}>
                    {d.title}
                  </p>
                  {d.description && (
                    <p className="text-gray-400 text-xs mt-0.5">{d.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {d.category}
                    </span>
                    <span className={`text-xs font-semibold ${getDaysColor(daysLeft)}`}>
                      {d.is_done ? 'Done' : daysLeft < 0 ? 'Expired' : daysLeft === 0 ? 'Due today!' : `${daysLeft} days left`}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteDeadline(d.id)}
                className="text-gray-600 hover:text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}