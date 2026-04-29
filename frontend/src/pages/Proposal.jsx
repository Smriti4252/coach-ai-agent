import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function Proposal() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [onboarding, setOnboarding] = useState(null)
  const [onboardLoading, setOnboardLoading] = useState(false)

  const leadId = localStorage.getItem('leadId')
  const leadName = localStorage.getItem('leadName')

  useEffect(() => { fetchProposal() }, [])

  const fetchProposal = async () => {
    setLoading(true)
    try {
      const res = await api.post(`/leads/proposal/${leadId}`)
      setPackages(res.data.packages)
    } catch (err) {
      setError('Could not load packages. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOnboard = async (pkg) => {
    setSelected(pkg)
    setOnboardLoading(true)
    try {
      const res = await api.post(`/leads/onboard/${leadId}`, null, {
        params: { package: pkg.name, first_session: 'Monday, May 5 at 10:00 AM' }
      })
      setOnboarding(res.data)
    } catch (err) {
      setError('Could not start onboarding. Please try again.')
    } finally {
      setOnboardLoading(false)
    }
  }

  const tiers = [
    { label: 'Starter', color: 'text-gray-500' },
    { label: 'Popular', color: 'text-blue-900' },
    { label: 'Premium', color: 'text-amber-600' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900
            text-xs font-medium px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900 inline-block" />
            Personalized Packages
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Coaching Plans, {leadName}
          </h1>
          <p className="text-gray-500 text-sm">
            We've curated 3 packages based on your goals. Pick the one that fits best.
          </p>
        </div>

        {loading && (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent
              rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Crafting your personalized packages...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm
            rounded-lg px-4 py-3 mb-6 max-w-md mx-auto text-center">
            {error}
          </div>
        )}

        {!loading && !onboarding && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border flex flex-col justify-between
                  transition duration-200 overflow-hidden
                  ${i === 1
                    ? 'border-blue-900 shadow-lg shadow-blue-900/10'
                    : 'border-gray-100 shadow-sm hover:shadow-md'
                  }`}
              >
                {/* popular badge */}
                {i === 1 && (
                  <div className="text-center py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: '#1e3a5f' }}>
                    ⭐ Most Popular
                  </div>
                )}

                <div className="p-6">
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${tiers[i].color}`}>
                    {tiers[i].label}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-1">{pkg.duration}</p>
                  <p className="text-xs text-gray-400 mb-5">{pkg.format}</p>

                  <div className="border-t border-gray-100 pt-5 mb-5">
                    <ul className="flex flex-col gap-2.5">
                      {pkg.deliverables && pkg.deliverables.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-3xl font-bold text-gray-900 mb-5"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pkg.price}
                  </p>

                  <button
                    onClick={() => handleOnboard(pkg)}
                    disabled={onboardLoading}
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition duration-200
                      ${i === 1
                        ? 'text-white hover:opacity-90'
                        : 'border border-gray-200 text-gray-700 hover:border-gray-400 bg-gray-50'
                      }`}
                    style={i === 1 ? { backgroundColor: '#1e3a5f' } : {}}
                  >
                    {onboardLoading && selected?.name === pkg.name
                      ? 'Processing...'
                      : 'Choose This Plan'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* onboarding result */}
        {onboarding && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
            p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200
                flex items-center justify-center mx-auto mb-4 text-2xl">
                🎉
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome, {leadName}!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {onboarding.welcome_message}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Your Onboarding Checklist
              </p>
              <div className="flex flex-col gap-3">
                {onboarding.checklist && onboarding.checklist.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50
                    border border-gray-100 rounded-xl px-4 py-3">
                    <span className="text-xs font-bold text-white px-2 py-0.5
                      rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#1e3a5f' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/thankyou')}
              className="mt-8 w-full py-3.5 rounded-lg text-white text-sm font-semibold
                transition duration-200 hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              Complete Onboarding →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Proposal