'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    const { data } = await supabase.from('mentors').select('*').eq('is_available', true).order('created_at', { ascending: false })
    setMentors(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4">
      <div>
        <h2 className="text-white font-bold text-lg">🤝 Peer Mentors</h2>
        <p className="text-gray-400 text-sm">Connect with students who have been there</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All' },
          { value: 'stream', label: `My Stream (${profile.stream})` },
          { value: 'state', label: `My State (${profile.state})` },
        ].map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading && [1,2,3].map(i => <div key={i} className="h-28 bg-gray-800 rounded-lg animate-pulse" />)}

      {!loading && filtered.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">No mentors found. Try "All".</p>
      )}

      {!loading && filtered.map(m => (
        <div key={m.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-semibold">{m.name}</h3>
              <p className="text-blue-400 text-sm">{m.college}</p>
            </div>
            <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">Available</span>
          </div>
          <p className="text-gray-400 text-sm">{m.bio}</p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{m.stream}</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{m.state}</span>
            </div>
            <a href={`https://wa.me/91${m.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-semibold">WhatsApp →</a>
          </div>
        </div>
      ))}
    </div>
  )
}