'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navbar({ name }: { name: string }) {
    const supabase = createClient()
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    async function handleLogout() {
        setLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    <span className="font-bold text-white text-sm">FirstGen Guidance</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full">
                        <span className="text-gray-400 text-xs"></span>
                        <span className="text-gray-300 text-xs font-medium">{name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                    <Link
                        href="/profile"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs rounded-lg font-semibold transition-colors"
                    >
                        Edit Profile
                    </Link>
                </div>

            </div>
        </nav>
    )
}