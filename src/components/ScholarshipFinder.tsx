'use client'

import { useState } from 'react'

interface Scholarship {
  name: string
  provider: string
  amount: string
  eligibility: string
  deadline: string
  link: string
}

export default function ScholarshipFinder({ profile }: { profile: any }) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetched, setFetched] = useState(false)

  async function findScholarships() {
  setLoading(true)
  setError('')
  try {
    const res = await fetch('/api/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    const data = await res.json()
    if (!Array.isArray(data)) {
      setError(data.error || 'Unexpected response. Try again.')
      setLoading(false)
      return
    }
    setScholarships(data)
    setFetched(true)
  } catch (e) {
    setError('Failed to fetch scholarships. Try again.')
  }
  setLoading(false)
}

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">🎓 Scholarships</h2>
          <p className="text-gray-400 text-sm">AI-matched to your profile</p>
        </div>
        <button
          onClick={findScholarships}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Finding...' : fetched ? 'Refresh' : 'Find Scholarships'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && scholarships.map((s, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-1 border border-gray-700">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold">{s.name}</h3>
            <span className="text-green-400 font-bold text-sm whitespace-nowrap">{s.amount}</span>
          </div>
          <p className="text-blue-400 text-sm">{s.provider}</p>
          <p className="text-gray-400 text-sm">{s.eligibility}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-500 text-xs">Deadline: {s.deadline}</span>
            
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-xs"
            <a>
              Apply →
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}