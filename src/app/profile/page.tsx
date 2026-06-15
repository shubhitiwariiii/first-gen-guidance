import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/ProfileEditForm'
import Sidebar from '@/components/Sidebar'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <Sidebar name={profile.full_name} email={user.email} />
      <main className="flex-1 ml-[220px]">

        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-8 py-4">
          <h1 className="text-white font-semibold">Edit Profile</h1>
          <p className="text-gray-500 text-xs mt-0.5">Update your details for better scholarship matching</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — form */}
            <div className="lg:col-span-2">
              <ProfileEditForm profile={profile} userId={user.id} />
            </div>

            {/* Right — info cards */}
            <div className="space-y-4">

              {/* Profile summary */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {profile.full_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-white font-bold">{profile.full_name}</h3>
                <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Class', value: profile.class_level },
                    { label: 'Stream', value: profile.stream },
                    { label: 'State', value: profile.state },
                    { label: 'Income', value: profile.family_income },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-white/3 rounded-lg">
                      <span className="text-gray-500 text-xs">{item.label}</span>
                      <span className="text-white text-xs font-medium">{item.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">Why update profile?</p>
                {[
                  'Better AI scholarship matches',
                  'More relevant mentor suggestions',
                  'State-specific opportunities',
                  'Income-based scholarship access',
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-2">
                    <span className="text-blue-500 text-xs mt-0.5">✓</span>
                    <p className="text-gray-400 text-xs">{tip}</p>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-3">Quick Links</p>
                <div className="space-y-2">
                  <a href="/dashboard" className="flex items-center justify-between px-3 py-2.5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl transition-all group">
                    <span className="text-gray-300 text-xs group-hover:text-white transition-colors">Dashboard</span>
                    <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">→</span>
                  </a>
                  <a href="/onboarding" className="flex items-center justify-between px-3 py-2.5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl transition-all group">
                    <span className="text-gray-300 text-xs group-hover:text-white transition-colors">Redo Onboarding</span>
                    <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">→</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}