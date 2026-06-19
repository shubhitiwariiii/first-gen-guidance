'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, GraduationCap } from 'lucide-react'

interface Tip {
  id: string
  mentor_name: string
  mentor_college: string
  mentor_avatar_color: string
  stream: string
  state: string
  question: string
  answer: string
}

const STREAM_COLORS: Record<string, string> = {
  Engineering: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Science: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Commerce: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Arts: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Medical: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function MentorTips({ profile }: { profile: any }) {
  const supabase = createClient()
  const [tips, setTips] = useState<Tip[]>([])
  const [filtered, setFiltered] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchTips() }, [])

  useEffect(() => {
    if (filter === 'all') setFiltered(tips)
    else if (filter === 'stream') setFiltered(tips.filter(t => t.stream === profile.stream))
    else if (filter === 'state') setFiltered(tips.filter(t => t.state === profile.state))
  }, [filter, tips])

  async function fetchTips() {
    const { data } = await supabase
      .from('mentor_tips')
      .select('*')
      .order('created_at', { ascending: false })
    setTips(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">

      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Mentor Tips</h2>
            <p className="text-gray-500 text-xs">{filtered.length} real student answers</p>
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

      <div className="p-6">
        {loading && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-72 shrink-0 h-48 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-600 text-xs">No tips for this filter yet</p>
          </div>
        )}

        {!loading && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {filtered.map(t => (
              <div
                key={t.id}
                className="w-72 shrink-0 bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 hover:border-white/15 transition-all flex flex-col"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.mentor_avatar_color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-xs">{t.mentor_name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{t.mentor_name}</p>
                    <p className="text-blue-400 text-xs truncate">{t.mentor_college}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-xs font-medium leading-relaxed mb-2">
                  "{t.question}"
                </p>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">
                  {t.answer}
                </p>

                {t.stream && (
                  <span className={`mt-3 self-start text-xs px-2 py-0.5 rounded-full border font-medium ${STREAM_COLORS[t.stream] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                    {t.stream}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}