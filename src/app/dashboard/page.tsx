import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ScholarshipFinder from '@/components/ScholarshipFinder'
import DeadlineTracker from '@/components/DeadlineTracker'
import MentorList from '@/components/MentorList'
import BecomeMentor from '@/components/BecomeMentor'
import DocumentUpload from '@/components/DocumentUpload'

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
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {profile.full_name} 👋
          </h1>
          <p className="text-gray-400 mt-1">Your personalized guidance dashboard</p>
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

        {/* Scholarship Finder */}
        <ScholarshipFinder profile={profile} hasAllDocs={hasAllDocs} />

        {/* Deadline Tracker */}
        <DeadlineTracker userId={user.id} />

        {/* MentorList Profile */}
        <MentorList profile={profile} />

        {/* Become Mentor Profile */}
        <BecomeMentor userId={user.id} profile={profile} />


        {/* Document upload */}
        <DocumentUpload userId={user.id} />

      </div>
    </div>
  )
}