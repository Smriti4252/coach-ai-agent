import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function LeadForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    timeline: '',
    budget: '',
    format: '',
    urgency: ''
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-8 py-12">
    <div className="bg-white rounded-2xl p-10 w-full max-w-4xl shadow-sm border border-slate-200">

        {/* header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Coaching Match</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Find your perfect plan</h2>
          <p className="text-slate-400 text-sm mt-1">Takes less than 2 minutes. No commitment required.</p>
        </div>

        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-3 gap-4">
            <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@email.com"
              className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">What is your main goal?</label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
            >
              <option value="">Select your goal</option>
              <option value="weight loss">Weight Loss & Fitness</option>
              <option value="business growth">Business Growth</option>
              <option value="confidence">Confidence & Mindset</option>
              <option value="career">Career Transition</option>
              <option value="relationships">Relationships & Life Balance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">When to start?</label>
              <select
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              >
                <option value="">Select timeline</option>
                <option value="immediately">This week</option>
                <option value="2 weeks">Within 2 weeks</option>
                <option value="1 month">Within 1 month</option>
                <option value="3 months">In 3 months</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Monthly budget</label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              >
                <option value="">Select budget</option>
                <option value="under $100">Under $100</option>
                <option value="$100-$300">$100 - $300</option>
                <option value="$300-$500">$300 - $500</option>
                <option value="above $500">Above $500</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Coaching format</label>
              <select
                name="format"
                value={form.format}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              >
                <option value="">Select format</option>
                <option value="1:1 calls">1:1 Video Calls</option>
                <option value="group program">Group Program</option>
                <option value="whatsapp coaching">WhatsApp Coaching</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Urgency</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 rounded-lg px-4 py-3 text-sm outline-none border border-slate-200 focus:border-violet-400 focus:bg-white transition"
              >
                <option value="">Select urgency</option>
                <option value="very urgent">Need help now</option>
                <option value="moderate">Planning ahead</option>
                <option value="just exploring">Just exploring</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="mt-1 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition text-sm"
          >
            {loading ? 'Analyzing your profile...' : 'Find My Coaching Plan →'}
          </button>

          <p className="text-center text-xs text-slate-400">
            No spam. No commitment. Just the right coaching for you.
          </p>

        </div>
      </div>
    </div>
  )
}

export default LeadForm