'use client'

import { useState } from 'react'
import { Search, ExternalLink, Lock, RefreshCw, Sparkles } from 'lucide-react'

interface Scholarship {
  name: string
  provider: string
  amount: string
  eligibility: string
  deadline: string
  link: string
  match_score?: number
  match_reason?: string
}

function getMatchStyle(score?: number) {
  if (score === undefined) return null
  if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  if (score >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
}

export default function ScholarshipFinder({ profile, hasAllDocs }: { profile: any, hasAllDocs: boolean }) {
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
      if (!Array.isArray(data)) { setError(data.error || 'Try again.'); setLoading(false); return }
      setScholarships(data)
      setFetched(true)
    } catch (e) {
      setError('Failed to fetch. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Scholarship Finder</h2>
            <p className="text-gray-500 text-xs">Matched to your profile</p>
          </div>
        </div>
        <button
          onClick={findScholarships}
          disabled={loading || !hasAllDocs}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            hasAllDocs
              ? 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/20'
              : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
        >
          {!hasAllDocs ? (
            <><Lock className="w-3.5 h-3.5" /> Upload docs first</>
          ) : loading ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Finding...</>
          ) : fetched ? (
            <><RefreshCw className="w-3.5 h-3.5" /> Refresh</>
          ) : (
            <><Search className="w-3.5 h-3.5" /> Find Scholarships</>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white/3 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !fetched && (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Find your scholarships</p>
            <p className="text-gray-600 text-xs mt-1">
              {hasAllDocs ? 'Click the button above to get AI-matched results' : 'Upload all required documents first'}
            </p>
          </div>
        )}

        {!loading && scholarships.map((s, i) => (
          <div key={i} className="group p-4 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all mb-3 last:mb-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-white text-sm font-semibold leading-snug flex-1">{s.name}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {s.match_score !== undefined && (
                  <span className={`font-bold text-xs whitespace-nowrap border px-2 py-1 rounded-lg ${getMatchStyle(s.match_score)}`}>
                    {s.match_score}% match
                  </span>
                )}
                <span className="text-emerald-400 font-bold text-xs whitespace-nowrap bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                  {s.amount}
                </span>
              </div>
            </div>
            <p className="text-blue-400 text-xs mb-1">{s.provider}</p>
            <p className="text-gray-500 text-xs mb-2">{s.eligibility}</p>
            {s.match_reason && (
              <p className="text-gray-600 text-xs italic mb-3">💡 {s.match_reason}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs">📅 {s.deadline}</span>
              <a href={s.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                Apply <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}