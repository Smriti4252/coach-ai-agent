import { useNavigate } from 'react-router-dom'

function ThankYou() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100
        p-10 max-w-md w-full text-center">

        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200
          flex items-center justify-center mx-auto mb-6 text-3xl">
          🎯
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          You're All Set!
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your onboarding is complete. Your coach will reach out shortly with everything
          you need to get started. Check your email for session details and next steps.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4
          text-sm text-blue-900 font-medium mb-8">
          📬 A confirmation has been sent to your email
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          {[
            { icon: '📅', label: 'Session Booked' },
            { icon: '✅', label: 'Plan Selected' },
            { icon: '🚀', label: 'Ready to Go' }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-lg border border-gray-200 text-gray-600
            text-sm font-medium hover:border-gray-400 transition duration-200"
        >
          Back to Home
        </button>

      </div>
    </div>
  )
}

export default ThankYou