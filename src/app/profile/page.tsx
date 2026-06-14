import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/ProfileEditForm'
import Navbar from '@/components/Navbar'

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
    <div className="min-h-screen bg-gray-950">
      <Navbar name={profile.full_name} />
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <p className="text-gray-400 mt-1">Update your details for better scholarship matching</p>
          </div>
          <ProfileEditForm profile={profile} userId={user.id} />
        </div>
      </div>
    </div>
  )
}