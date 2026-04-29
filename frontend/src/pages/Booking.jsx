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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {!confirmed ? (
          <>
            <div className="text-center mb-12">
              <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Discovery Call</p>
              <h1 className="text-4xl font-light text-stone-800 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome, {leadName}
              </h1>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                {bookingMessage}
              </p>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm p-8">
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">
                Available Time Slots
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(slot)}
                    className={`w-full text-left px-6 py-4 border text-sm transition duration-300
                      ${selected === slot
                        ? 'border-amber-500 bg-amber-50 text-amber-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                  >
                    <span className="text-xs tracking-widest uppercase text-stone-300 mr-4">
                      0{i + 1}
                    </span>
                    {slot}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-xs tracking-wide mb-6 border-l-2 border-red-300 pl-3">
                  {error}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={!selected || loading}
                className="w-full bg-stone-900 hover:bg-amber-600 disabled:opacity-30
                  text-white text-xs tracking-widest uppercase py-4 transition duration-500"
              >
                {loading ? 'Confirming...' : 'Confirm My Slot →'}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white border border-stone-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200
              flex items-center justify-center mx-auto mb-6 text-xl">
              ✓
            </div>
            <h2 className="text-3xl font-light text-stone-800 mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              You're Confirmed
            </h2>
            <p className="text-stone-400 text-sm font-light mb-8 leading-relaxed">{confirmed}</p>
            <div className="bg-stone-50 border border-stone-100 px-6 py-4 text-sm
              text-stone-600 tracking-wide mb-8">
              {selected}
            </div>
            <button
              onClick={() => navigate('/proposal')}
              className="w-full bg-stone-900 hover:bg-amber-600 text-white
                text-xs tracking-widest uppercase py-4 transition duration-500"
            >
              View Coaching Packages →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Booking