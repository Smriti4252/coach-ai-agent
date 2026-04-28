import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function Booking() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState(null)

  const leadId = localStorage.getItem('leadId')
  const leadName = localStorage.getItem('leadName')
  const bookingMessage = localStorage.getItem('bookingMessage')
  const slots = JSON.parse(localStorage.getItem('slots') || '[]')

  const handleConfirm = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.post(`/leads/book/${leadId}`, null, {
        params: { chosen_slot: selected }
      })
      setConfirmed(res.data.confirmation_message)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-8 py-12">
      <div className="bg-white rounded-2xl p-10 w-full max-w-2xl shadow-sm border border-slate-200">

        {!confirmed ? (
          <>
            {/* header */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Discovery Call</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                Great news, {leadName}! 🎉
              </h2>
              <p className="text-slate-400 text-sm mt-2">{bookingMessage}</p>
            </div>

            {/* score badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                🔥 HOT Lead
              </span>
              <span className="text-slate-400 text-xs">You qualify for a free discovery call</span>
            </div>

            {/* slots */}
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-sm font-medium text-slate-600">Pick a time that works for you:</p>
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(slot)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition
                    ${selected === slot
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300'
                    }`}
                >
                  <span className="mr-3">📅</span>{slot}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selected || loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Confirming your slot...' : 'Confirm My Slot →'}
            </button>
          </>
        ) : (
          <>
            {/* confirmation screen */}
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">You're booked!</h2>
              <p className="text-slate-500 text-sm mb-6">{confirmed}</p>
              <div className="bg-violet-50 border border-violet-100 rounded-xl px-6 py-4 text-sm text-violet-700 font-medium mb-8">
                📅 {selected}
              </div>
              <button
                onClick={() => navigate('/proposal')}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg transition text-sm"
              >
                View Coaching Packages →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Booking