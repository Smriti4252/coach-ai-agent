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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">

        {!confirmed ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {/* header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700
                text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                You qualify for a free discovery call
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Book Your Discovery Call
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {bookingMessage}
              </p>
            </div>

            {/* divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* slots */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Available Time Slots
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(slot)}
                  className={`w-full text-left px-4 py-4 rounded-xl border text-sm
                    font-medium transition duration-200 flex items-center gap-3
                    ${selected === slot
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-gray-50'
                    }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center
                    justify-center flex-shrink-0
                    ${selected === slot ? 'border-blue-900' : 'border-gray-300'}`}>
                    {selected === slot && (
                      <span className="w-2 h-2 rounded-full bg-blue-900 inline-block" />
                    )}
                  </span>
                  <span>📅 {slot}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm
                rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selected || loading}
              className="w-full py-3.5 rounded-lg text-white text-sm font-semibold
                transition duration-200 hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {loading ? 'Confirming your slot...' : 'Confirm My Slot →'}
            </button>

          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200
              flex items-center justify-center mx-auto mb-5 text-2xl">
              ✅
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              You're Booked!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{confirmed}</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3
              text-sm text-blue-900 font-medium mb-6">
              📅 {selected}
            </div>
            <button
              onClick={() => navigate('/proposal')}
              className="w-full py-3.5 rounded-lg text-white text-sm font-semibold
                transition duration-200 hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
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