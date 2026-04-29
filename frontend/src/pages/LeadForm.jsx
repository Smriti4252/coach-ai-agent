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

  const inputClass = `w-full bg-white text-stone-800 rounded-none px-4 py-3 text-sm
    outline-none border-b border-stone-200 focus:border-amber-500 transition duration-300
    placeholder-stone-300`

  const selectClass = `w-full bg-white text-stone-700 rounded-none px-4 py-3 text-sm
    outline-none border-b border-stone-200 focus:border-amber-500 transition duration-300`

  const labelClass = `text-xs tracking-widest uppercase text-stone-400 mb-2 block`

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">

        {/* header */}
        <div className="mb-14 text-center">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Begin Your Journey</p>
          <h1 className="text-5xl font-light text-stone-800 leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Find Your Perfect<br />Coaching Plan
          </h1>
          <p className="text-stone-400 text-sm font-light">
            Answer a few questions. We'll match you with the right coach and package.
          </p>
        </div>

        {/* form card */}
        <div className="bg-white border border-stone-100 shadow-sm p-10">

          <div className="grid grid-cols-3 gap-8 mb-8">
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

          <div className="mb-8">
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

          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <label className={labelClass}>When to start?</label>
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
              <label className={labelClass}>Coaching Format</label>
              <select name="format" value={form.format} onChange={handleChange} className={selectClass}>
                <option value="">Select format</option>
                <option value="1:1 calls">1:1 Video Calls</option>
                <option value="group program">Group Program</option>
                <option value="whatsapp coaching">WhatsApp Coaching</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mb-10">
            <label className={labelClass}>How urgent is this for you?</label>
            <select name="urgency" value={form.urgency} onChange={handleChange} className={selectClass}>
              <option value="">Select urgency</option>
              <option value="very urgent">Very urgent — I need help now</option>
              <option value="moderate">Moderate — planning ahead</option>
              <option value="just exploring">Just exploring options</option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide mb-6 border-l-2 border-red-300 pl-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full bg-stone-900 hover:bg-amber-600 disabled:opacity-30
              text-white text-xs tracking-widest uppercase py-4 transition duration-500 font-medium"
          >
            {loading ? 'Analyzing your profile...' : 'Find My Coaching Plan →'}
          </button>

          <p className="text-center text-xs text-stone-300 mt-5 tracking-wide">
            No commitment required · Completely confidential
          </p>

        </div>
      </div>
    </div>
  )
}

export default LeadForm