'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, ExternalLink, ClipboardList } from 'lucide-react'

interface Application {
  id: string
  scholarship_name: string
  provider: string
  amount: string
  status: string
  applied_date: string
  deadline: string
  notes: string
  link: string
}

const STATUSES = [
  { value: 'planning', label: 'Planning', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
  { value: 'applied', label: 'Applied', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { value: 'received', label: 'Received', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
]

export default function ApplicationTracker({ userId }: { userId: string }) {
  const supabase = createClient()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    scholarship_name: '',
    provider: '',
    amount: '',
    status: 'planning',
    applied_date: '',
    deadline: '',
    notes: '',
    link: '',
  })

  useEffect(() => { fetchApplications() }, [])

  async function fetchApplications() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setApplications(data || [])
    setLoading(false)
  }

  async function addApplication() {
    if (!form.scholarship_name) return
    await supabase.from('applications').insert({ user_id: userId, ...form })
    setForm({ scholarship_name: '', provider: '', amount: '', status: 'planning', applied_date: '', deadline: '', notes: '', link: '' })
    setAdding(false)
    fetchApplications()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('applications').update({ status }).eq('id', id)
    fetchApplications()
  }

  async function deleteApplication(id: string) {
    await supabase.from('applications').delete().eq('id', id)
    fetchApplications()
  }

  function getStatusStyle(status: string) {
    return STATUSES.find(s => s.value === status)?.color || STATUSES[0].color
  }

  function getStatusLabel(status: string) {
    return STATUSES.find(s => s.value === status)?.label || status
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Applications</h2>
            <p className="text-gray-500 text-xs">{applications.length} tracked</p>
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
            placeholder="Scholarship name *"
            value={form.scholarship_name}
            onChange={e => setForm(f => ({ ...f, scholarship_name: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
          />
          <div className="flex gap-2">
            <input
              placeholder="Provider"
              value={form.provider}
              onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
            />
            <input
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
            >
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <input
            placeholder="Link (optional)"
            value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
          />
          <input
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            onClick={addApplication}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Add Application
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="px-5 py-3 border-b border-white/5 flex gap-1.5 overflow-x-auto">
        {['all', ...STATUSES.map(s => s.value)].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {f === 'all' ? 'All' : getStatusLabel(f)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
        {loading && [1, 2].map(i => <div key={i} className="h-16 bg-white/3 rounded-xl animate-pulse" />)}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-8">
            <ClipboardList className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-600 text-xs">No applications yet</p>
            <p className="text-gray-700 text-xs mt-1">Click + to track a scholarship</p>
          </div>
        )}

        {!loading && filtered.map(app => (
          <div key={app.id} className="p-3 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{app.scholarship_name}</p>
                {app.provider && <p className="text-gray-500 text-xs truncate">{app.provider}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {app.amount && (
                  <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {app.amount}
                  </span>
                )}
                {app.link && (
                  <a href={app.link} target="_blank" rel="noopener noreferrer"
                    className="w-5 h-5 rounded flex items-center justify-center hover:bg-blue-500/10 text-gray-600 hover:text-blue-400 transition-all">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <select
                value={app.status}
                onChange={e => updateStatus(app.id, e.target.value)}
                className={`text-xs px-2 py-0.5 rounded-full border font-medium bg-transparent cursor-pointer focus:outline-none ${getStatusStyle(app.status)}`}
              >
                {STATUSES.map(s => <option key={s.value} value={s.value} className="bg-[#0d0d14] text-white">{s.label}</option>)}
              </select>
              {app.deadline && (
                <span className="text-gray-600 text-xs">
                  Due {new Date(app.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
              {app.notes && <span className="text-gray-600 text-xs truncate">{app.notes}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}