import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function LeadForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    goal: '', timeline: '', budget: '',
    format: '', urgency: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/leads/submit', form)
      const data = res.data
      localStorage.setItem('leadId', data.lead_id)
      localStorage.setItem('leadScore', data.score)
      localStorage.setItem('leadName', form.name)
      if (data.score === 'HOT') {
        localStorage.setItem('slots', JSON.stringify(data.slots))
        localStorage.setItem('bookingMessage', data.booking_message)
        navigate('/booking')
      } else {
        localStorage.setItem('leadReason', data.reason)
        navigate('/proposal')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = Object.values(form).every(v => v !== '')

  const inputClass = `w-full bg-gray-50 text-gray-800 rounded-lg px-4 py-3 text-sm
    outline-none border border-gray-200 focus:border-blue-900 focus:bg-white
    transition duration-200 placeholder-gray-300`

  const selectClass = `w-full bg-gray-50 text-gray-700 rounded-lg px-4 py-3 text-sm
    outline-none border border-gray-200 focus:border-blue-900 focus:bg-white
    transition duration-200`

  const labelClass = `text-xs font-medium text-gray-500 mb-1.5 block`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">

        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 text-xs
            font-medium px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900 inline-block" />
            Free Coaching Match
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Find Your Perfect Coaching Plan
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Tell us about your goals and we'll match you with the right coach and package in seconds.
          </p>
        </div>

        {/* form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* row 1 */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Jane Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="jane@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+1 234 567 8900" className={inputClass} />
            </div>
          </div>

          {/* row 2 */}
          <div className="mb-5">
            <label className={labelClass}>What is your primary goal?</label>
            <select name="goal" value={form.goal} onChange={handleChange} className={selectClass}>
              <option value="">Select your goal</option>
              <option value="weight loss">Weight Loss & Fitness</option>
              <option value="business growth">Business Growth</option>
              <option value="confidence">Confidence & Mindset</option>
              <option value="career">Career Transition</option>
              <option value="relationships">Relationships & Life Balance</option>
            </select>
          </div>

          {/* row 3 */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelClass}>When do you want to start?</label>
              <select name="timeline" value={form.timeline} onChange={handleChange} className={selectClass}>
                <option value="">Select timeline</option>
                <option value="immediately">This week</option>
                <option value="2 weeks">Within 2 weeks</option>
                <option value="1 month">Within 1 month</option>
                <option value="3 months">In 3 months</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Monthly Budget</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                <option value="">Select budget</option>
                <option value="under $100">Under $100</option>
                <option value="$100-$300">$100 — $300</option>
                <option value="$300-$500">$300 — $500</option>
                <option value="above $500">Above $500</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred Format</label>
              <select name="format" value={form.format} onChange={handleChange} className={selectClass}>
                <option value="">Select format</option>
                <option value="1:1 calls">1:1 Video Calls</option>
                <option value="group program">Group Program</option>
                <option value="whatsapp coaching">WhatsApp Coaching</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* row 4 */}
          <div className="mb-6">
            <label className={labelClass}>How urgent is this for you?</label>
            <select name="urgency" value={form.urgency} onChange={handleChange} className={selectClass}>
              <option value="">Select urgency</option>
              <option value="very urgent">Very urgent — I need help now</option>
              <option value="moderate">Moderate — planning ahead</option>
              <option value="just exploring">Just exploring options</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm
              rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full py-3.5 rounded-lg text-white text-sm font-semibold
              transition duration-200 hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            {loading ? 'Analyzing your profile...' : 'Find My Coaching Plan →'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            No commitment required · 100% confidential · Free to use
          </p>

        </div>
      </div>
    </div>
  )
}

export default LeadForm