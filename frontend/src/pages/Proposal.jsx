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
  const leadScore = localStorage.getItem('leadScore')

  useEffect(() => {
    fetchProposal()
  }, [])

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
        params: {
          package: pkg.name,
          first_session: 'Monday, May 5 at 10:00 AM'
        }
      })
      setOnboarding(res.data)
    } catch (err) {
      setError('Could not start onboarding. Please try again.')
    } finally {
      setOnboardLoading(false)
    }
  }

  const scoreBadge = {
    HOT: 'bg-green-100 text-green-700',
    WARM: 'bg-yellow-100 text-yellow-700',
    COLD: 'bg-slate-100 text-slate-500'
  }

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-12">
      <div className="max-w-4xl mx-auto">

        {/* header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Your Coaching Plan</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            Here's what we recommend, {leadName}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${scoreBadge[leadScore] || scoreBadge.WARM}`}>
              {leadScore} Lead
            </span>
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="text-center py-20 text-slate-400 text-sm">
            Generating your personalized packages...
          </div>
        )}

        {/* error */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {/* packages */}
        {!loading && !onboarding && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition
                  ${i === 1 ? 'border-violet-400 ring-2 ring-violet-100' : 'border-slate-200'}`}
              >
                {i === 1 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold bg-violet-600 text-white px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-400 mb-1">{pkg.duration}</p>
                  <p className="text-sm text-slate-400 mb-4">{pkg.format}</p>

                  <ul className="flex flex-col gap-2 mb-6">
                    {pkg.deliverables && pkg.deliverables.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-violet-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-800 mb-4">{pkg.price}</p>
                  <button
                    onClick={() => handleOnboard(pkg)}
                    disabled={onboardLoading}
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition
                      ${i === 1
                        ? 'bg-violet-600 hover:bg-violet-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                  >
                    {onboardLoading && selected?.name === pkg.name
                      ? 'Starting...'
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
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-slate-800">Welcome aboard, {leadName}!</h3>
              <p className="text-slate-400 text-sm mt-2">{onboarding.welcome_message}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-4">Your onboarding checklist:</p>
              <div className="flex flex-col gap-3">
                {onboarding.checklist && onboarding.checklist.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                  >
                    <span className="bg-violet-100 text-violet-600 text-xs font-bold px-2 py-1 rounded-full">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-8 w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg transition text-sm"
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