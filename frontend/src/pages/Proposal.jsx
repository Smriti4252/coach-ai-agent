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

  const tiers = ['Essential', 'Signature', 'Elite']

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Your Coaching Plan</p>
          <h1 className="text-5xl font-light text-stone-800 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Curated for You, {leadName}
          </h1>
          <p className="text-stone-400 text-sm font-light">
            Three plans tailored to your goals and timeline. Choose what fits best.
          </p>
        </div>

        {loading && (
          <div className="text-center py-24 text-stone-300 text-sm tracking-widest uppercase">
            Crafting your packages...
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs tracking-wide mb-6 border-l-2 border-red-300 pl-3">
            {error}
          </p>
        )}

        {!loading && !onboarding && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`bg-white border flex flex-col justify-between p-8 transition duration-300
                  ${i === 1
                    ? 'border-amber-300 shadow-md'
                    : 'border-stone-100 shadow-sm hover:border-stone-300'
                  }`}
              >
                <div>
                  {i === 1 && (
                    <p className="text-xs tracking-widest uppercase text-amber-600 mb-4">
                      Most Popular
                    </p>
                  )}
                  <p className="text-xs tracking-widest uppercase text-stone-300 mb-2">
                    {tiers[i]}
                  </p>
                  <h3 className="text-2xl font-light text-stone-800 mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-stone-400 mb-1">{pkg.duration}</p>
                  <p className="text-xs text-stone-400 mb-6">{pkg.format}</p>

                  <div className="border-t border-stone-100 pt-6 mb-6">
                    <ul className="flex flex-col gap-3">
                      {pkg.deliverables && pkg.deliverables.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-stone-600 font-light">
                          <span className="text-amber-500 text-xs mt-1">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-light text-stone-800 mb-6"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {pkg.price}
                  </p>
                  <button
                    onClick={() => handleOnboard(pkg)}
                    disabled={onboardLoading}
                    className={`w-full py-3 text-xs tracking-widest uppercase transition duration-500
                      ${i === 1
                        ? 'bg-stone-900 hover:bg-amber-600 text-white'
                        : 'border border-stone-200 hover:border-stone-900 text-stone-600 hover:text-stone-900'
                      }`}
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

        {onboarding && (
          <div className="bg-white border border-stone-100 shadow-sm p-12 max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200
                flex items-center justify-center mx-auto mb-6 text-amber-600 font-light text-xl">
                ✓
              </div>
              <h2 className="text-3xl font-light text-stone-800 mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome, {leadName}
              </h2>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                {onboarding.welcome_message}
              </p>
            </div>

            <div className="border-t border-stone-100 pt-8">
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">
                Your Onboarding Checklist
              </p>
              <div className="flex flex-col gap-3">
                {onboarding.checklist && onboarding.checklist.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-stone-50">
                    <span className="text-xs text-amber-500 font-medium mt-0.5 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-stone-600 font-light">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/thankyou')}
              className="mt-10 w-full bg-stone-900 hover:bg-amber-600 text-white
                text-xs tracking-widest uppercase py-4 transition duration-500"
            >
              Go to Dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Proposal