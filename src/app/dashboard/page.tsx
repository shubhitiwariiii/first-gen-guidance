import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ScholarshipFinder from '@/components/ScholarshipFinder'
import DeadlineTracker from '@/components/DeadlineTracker'
import MentorList from '@/components/MentorList'
import BecomeMentor from '@/components/BecomeMentor'
import DocumentUpload from '@/components/DocumentUpload'
import Sidebar from '@/components/Sidebar'

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

  const { data: documents } = await supabase
    .from('documents')
    .select('category')
    .eq('user_id', user.id)

  const requiredCategories = ['marksheet', 'income', 'id_proof', 'certificate']
  const hasAllDocs = requiredCategories.every(
    cat => documents?.some(d => d.category === cat)
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">

      {/* Sidebar */}
      <Sidebar name={profile.full_name} email={user.email} />

      {/* Main content */}
      <main className="flex-1 ml-[220px] min-h-screen">

        {/* Top header bar */}
        <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold">Dashboard</h1>
              <p className="text-gray-500 text-xs mt-0.5">Welcome back, {profile.full_name?.split(' ')[0]}</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: profile.class_level, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { label: profile.stream, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                { label: profile.state, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              ].map(tag => tag.label && (
                <span key={tag.label} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tag.color}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Class', value: profile.class_level, icon: '🎓' },
              { label: 'Stream', value: profile.stream, icon: '📚' },
              { label: 'Income Group', value: profile.family_income, icon: '💰' },
              { label: 'Documents', value: `${documents?.length || 0}/4`, icon: '📄' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">{stat.label}</span>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <p className="text-white font-semibold text-sm">{stat.value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left - 2 cols */}
            <div className="xl:col-span-2 space-y-6">
              <div id="scholarships">
                <ScholarshipFinder profile={profile} hasAllDocs={hasAllDocs} />
              </div>
              <div id="mentors">
                <MentorList profile={profile} />
              </div>
              <BecomeMentor userId={user.id} profile={profile} />
            </div>

            {/* Right - 1 col */}
            <div className="space-y-6">
              <div id="deadlines">
                <DeadlineTracker userId={user.id} />
              </div>
              <div id="documents">
                <DocumentUpload userId={user.id} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}