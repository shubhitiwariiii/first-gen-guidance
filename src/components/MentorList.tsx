'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, MessageCircle } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  stream: string
  class_level: string
  state: string
  college: string
  bio: string
  whatsapp: string
  is_available: boolean
}

const STREAM_COLORS: Record<string, string> = {
  Engineering: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Science: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Commerce: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Arts: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Medical: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const AVATAR_COLORS = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
  'from-cyan-500 to-blue-600',
]

export default function MentorList({ profile }: { profile: any }) {
  const supabase = createClient()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filtered, setFiltered] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchMentors() }, [])

  useEffect(() => {
    if (filter === 'all') setFiltered(mentors)
    else if (filter === 'stream') setFiltered(mentors.filter(m => m.stream === profile.stream))
    else if (filter === 'state') setFiltered(mentors.filter(m => m.state === profile.state))
  }, [filter, mentors])

  async function fetchMentors() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('mentors')
      .select('*')
      .eq('is_available', true)
      .neq('user_id', user?.id)
    setMentors(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Peer Mentors</h2>
            <p className="text-gray-500 text-xs">{filtered.length} mentors available</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[
            { value: 'all', label: 'All' },
            { value: 'stream', label: profile.stream },
            { value: 'state', label: profile.state },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filter === tab.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/8'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scrollable cards */}
      <div className="p-6">
        {loading && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-64 shrink-0 h-40 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-600 text-xs">No mentors for this filter</p>
          </div>
        )}

        {!loading && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {filtered.map((m, i) => (
              <div
                key={m.id}
                className="w-64 shrink-0 bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
              >
                {/* Top */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-sm">{m.name[0]}</span>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{m.name}</h3>
                  <p className="text-blue-400 text-xs mt-0.5">{m.college}</p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2">{m.bio}</p>
                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STREAM_COLORS[m.stream] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                    {m.stream}
                  </span>
                  <a href={`https://wa.me/91${m.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 text-gray-400 hover:text-blue-400 text-xs rounded-lg font-medium transition-all"><MessageCircle className="w-3 h-3" />Connect</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}