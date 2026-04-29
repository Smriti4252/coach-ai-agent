import { useState, useEffect } from 'react'
import api from '../utils/api'

function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchLeads() }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await api.get('/leads/all')
      setLeads(res.data.leads)
    } catch (err) {
      setError('Could not load leads.')
    } finally {
      setLoading(false)
    }
  }

  const total = leads.length
  const hot = leads.filter(l => l.score === 'HOT').length
  const warm = leads.filter(l => l.score === 'WARM').length
  const cold = leads.filter(l => l.score === 'COLD').length
  const booked = leads.filter(l => l.status === 'booked').length
  const onboarded = leads.filter(l => l.status === 'onboarded').length

  const stats = [
    { label: 'Total Leads', value: total, color: 'text-gray-900' },
    { label: 'Hot Leads', value: hot, color: 'text-red-500' },
    { label: 'Warm Leads', value: warm, color: 'text-amber-500' },
    { label: 'Cold Leads', value: cold, color: 'text-blue-400' },
    { label: 'Booked', value: booked, color: 'text-blue-900' },
    { label: 'Onboarded', value: onboarded, color: 'text-green-600' },
  ]

  const scoreBadge = {
    HOT: 'bg-red-50 text-red-600',
    WARM: 'bg-amber-50 text-amber-600',
    COLD: 'bg-blue-50 text-blue-500'
  }

  const statusBadge = {
    new: 'bg-gray-100 text-gray-500',
    booked: 'bg-blue-50 text-blue-700',
    proposal_sent: 'bg-amber-50 text-amber-700',
    onboarded: 'bg-green-50 text-green-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Lead Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time pipeline and conversion tracking
            </p>
          </div>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm
              text-gray-600 hover:border-gray-400 transition duration-200"
          >
            Refresh ↻
          </button>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100
              shadow-sm p-5">
              <p className="text-xs text-gray-400 font-medium mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-5">Pipeline Overview</p>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Booking Rate</span>
                <span className="font-medium text-gray-600">
                  {total > 0 ? Math.round((booked / total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{
                    width: total > 0 ? `${(booked / total) * 100}%` : '0%',
                    backgroundColor: '#1e3a5f'
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Conversion Rate</span>
                <span className="font-medium text-gray-600">
                  {total > 0 ? Math.round((onboarded / total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: total > 0 ? `${(onboarded / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-700">All Leads</p>
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent
                rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading leads...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-red-400 text-sm">{error}</div>
          )}

          {!loading && leads.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No leads yet. Share your form to get started.
            </div>
          )}

          {!loading && leads.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Name', 'Email', 'Goal', 'Budget', 'Score', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold
                      text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{lead.email}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize text-xs">{lead.goal}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{lead.budget}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${scoreBadge[lead.score] || 'bg-gray-100 text-gray-500'}`}>
                        {lead.score || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${statusBadge[lead.status] || 'bg-gray-100 text-gray-500'}`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard