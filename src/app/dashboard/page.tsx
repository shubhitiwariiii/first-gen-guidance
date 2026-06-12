import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {profile.full_name} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Your personalized guidance dashboard
          </p>
        </div>

        {/* Profile summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Class', value: profile.class_level },
            { label: 'Stream', value: profile.stream },
            { label: 'State', value: profile.state },
            { label: 'Income Group', value: profile.family_income },
          ].map(item => (
            <div key={item.label} className="bg-gray-900 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className="text-white font-semibold mt-1">{item.value || '—'}</p>
            </div>
          ))}
        </div>

        {/* Coming soon cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: '🎓 Scholarships', desc: 'Matched to your profile' },
            { title: '📅 Deadlines', desc: 'Track application dates' },
            { title: '🤝 Mentors', desc: 'Connect with peers' },
          ].map(card => (
            <div key={card.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-bold text-lg">{card.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
              <span className="inline-block mt-3 text-xs bg-gray-800 text-gray-500 px-2 py-1 rounded">
                Coming soon
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}