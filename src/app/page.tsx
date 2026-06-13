import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-lg">FirstGen Guidance</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="inline-block bg-blue-900 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          Free · For Indian Students · No Paid Mentors Needed
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Your guide to scholarships,{' '}
          <span className="text-blue-400">when no one else is.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Built for first-generation Indian students from non-English, non-urban families
          who have no one to guide them through college applications and scholarships.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link href="/signup" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors">
            Start for Free →
          </Link>
          <Link href="/login" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors">
            Login
          </Link>
        </div>
        <p className="text-gray-600 text-sm">No credit card. No paid plans. Always free.</p>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: '600M+', label: 'First-gen learners in India' },
            { number: '₹50K+', label: 'Avg scholarship per student' },
            { number: '80%', label: 'Students miss scholarships' },
            { number: '0₹', label: 'Cost to use this platform' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
              <p className="text-3xl font-bold text-blue-400">{stat.number}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">Everything you need, in one place</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🎓',
              title: 'AI Scholarship Finder',
              desc: 'Get scholarships matched to your profile — stream, state, income, and class level. No more manual searching.'
            },
            {
              icon: '📅',
              title: 'Deadline Tracker',
              desc: 'Never miss an application deadline. Track all your scholarship and college deadlines in one place.'
            },
            {
              icon: '🤝',
              title: 'Peer Mentor Matching',
              desc: 'Connect with students from similar backgrounds who have already navigated the system.'
            },
            {
              icon: '📄',
              title: 'Document Manager',
              desc: 'Upload and organize your marksheets, income certificates, and ID proofs — ready when you need them.'
            },
          ].map(feature => (
            <div key={feature.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-2">
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="text-white font-bold text-lg">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <h2 className="text-2xl font-bold text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create your profile', desc: 'Tell us your class, stream, state, and family income in 2 minutes.' },
            { step: '02', title: 'Upload your documents', desc: 'Upload marksheets and certificates once. Use them for all applications.' },
            { step: '03', title: 'Get matched', desc: 'AI finds scholarships you qualify for and mentors who can guide you.' },
          ].map(item => (
            <div key={item.step} className="space-y-3">
              <span className="text-4xl font-bold text-blue-900">{item.step}</span>
              <h3 className="text-white font-bold">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-blue-600 rounded-2xl p-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to find your scholarship?</h2>
          <p className="text-blue-200">Join thousands of first-gen students getting the guidance they deserve.</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-sm">FirstGen Guidance</span>
        </div>
        <p className="text-gray-600 text-sm">Built by Shubhi Tiwari · For first-gen students of India</p>
      </footer>

    </div>
  )
}