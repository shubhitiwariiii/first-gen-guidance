import Link from 'next/link'
import { GraduationCap, Search, Calendar, Users, FileText, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">FirstGen Guidance</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Free · For Indian Students · No Paid Mentors Needed
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Your guide to
            <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              scholarships,
            </span>
            when no one else is.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Built for first-generation Indian students from non-English, non-urban families
            who have no one to guide them through college applications and scholarships.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Log in
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'Always free', 'Built for Bharat'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '600M+', label: 'First-gen learners in India' },
            { number: '₹50K+', label: 'Avg scholarship per student' },
            { number: '80%', label: 'Students miss scholarships' },
            { number: '0₹', label: 'Cost to use this platform' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, in one place</h2>
            <p className="text-gray-400 max-w-xl mx-auto">A complete platform built specifically for first-generation Indian students.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Search,
                title: 'AI Scholarship Finder',
                desc: 'Get scholarships matched to your profile — stream, state, income, and class level. No more manual searching.',
                color: 'from-blue-500/20 to-blue-600/5',
                iconColor: 'text-blue-400',
                border: 'border-blue-500/20',
              },
              {
                icon: Calendar,
                title: 'Deadline Tracker',
                desc: 'Never miss an application deadline. Track all your scholarship and college deadlines in one place.',
                color: 'from-cyan-500/20 to-cyan-600/5',
                iconColor: 'text-cyan-400',
                border: 'border-cyan-500/20',
              },
              {
                icon: Users,
                title: 'Peer Mentor Matching',
                desc: 'Connect with students from similar backgrounds who have already navigated the system successfully.',
                color: 'from-violet-500/20 to-violet-600/5',
                iconColor: 'text-violet-400',
                border: 'border-violet-500/20',
              },
              {
                icon: FileText,
                title: 'Document Manager',
                desc: 'Upload and organize marksheets, income certificates, and ID proofs — ready when you need them.',
                color: 'from-emerald-500/20 to-emerald-600/5',
                iconColor: 'text-emerald-400',
                border: 'border-emerald-500/20',
              },
            ].map(feature => (
              <div key={feature.title} className={`relative bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-8 hover:scale-[1.02] transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor} mb-4`} />
                <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400">From confused to confident in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your profile', desc: 'Tell us your class, stream, state, and family income in 2 minutes.', color: 'text-blue-400' },
              { step: '02', title: 'Upload your documents', desc: 'Upload marksheets and certificates once. Use them for all applications.', color: 'text-cyan-400' },
              { step: '03', title: 'Get matched', desc: 'AI finds scholarships you qualify for and mentors who can guide you.', color: 'text-violet-400' },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-16 h-px bg-white/10 z-10" />
                )}
                <div className={`text-5xl font-bold ${item.color} mb-4 opacity-50`}>{item.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
            <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">Ready to find your scholarship?</h2>
              <p className="text-blue-200 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Join thousands of first-gen students getting the guidance they deserve.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-50 transition-all hover:scale-105">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">FirstGen Guidance</span>
          </div>
          <p className="text-gray-600 text-sm">Built by Shubhi Tiwari · For first-gen students of India</p>
        </div>
      </footer>

    </div>
  )
}