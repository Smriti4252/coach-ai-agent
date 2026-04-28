import { useState, useEffect } from 'react'
import api from '../utils/api'

function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

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

  const scoreBadge = {
    HOT: 'bg-green-100 text-green-700',
    WARM: 'bg-yellow-100 text-yellow-700',
    COLD: 'bg-slate-100 text-slate-500'
  }

  const statusBadge = {
    new: 'bg-blue-100 text-blue-600',
    booked: 'bg-violet-100 text-violet-600',
    proposal_sent: 'bg-orange-100 text-orange-600',
    onboarded: 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-12">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Coach AI</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Lead Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Track your leads, bookings, and conversions.</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Leads', value: total, color: 'text-slate-800' },
            { label: 'Hot', value: hot, color: 'text-green-600' },
            { label: 'Warm', value: warm, color: 'text-yellow-500' },
            { label: 'Cold', value: cold, color: 'text-slate-400' },
            { label: 'Booked', value: booked, color: 'text-violet-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-400 font-medium mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* conversion bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <p className="text-sm font-semibold text-slate-700 mb-4">Pipeline Overview</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-violet-500 h-3 rounded-full transition-all"
                style={{ width: total > 0 ? `${(booked / total) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {total > 0 ? Math.round((booked / total) * 100) : 0}% booking rate
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: total > 0 ? `${(onboarded / total) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {total > 0 ? Math.round((onboarded / total) * 100) : 0}% conversion rate
            </span>
          </div>
        </div>

        {/* leads table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">All Leads</p>
            <button
              onClick={fetchLeads}
              className="text-xs text-violet-600 hover:text-violet-500 font-medium transition"
            >
              Refresh ↻
            </button>
          </div>

          {loading && (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading leads...
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              No leads yet. Share your form to get started.
            </div>
          )}

          {!loading && leads.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Goal</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Budget</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Score</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-slate-700">{lead.name}</td>
                      <td className="px-6 py-4 text-slate-400">{lead.email}</td>
                      <td className="px-6 py-4 text-slate-600 capitalize">{lead.goal}</td>
                      <td className="px-6 py-4 text-slate-600">{lead.budget}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${scoreBadge[lead.score] || 'bg-slate-100 text-slate-500'}`}>
                          {lead.score || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge[lead.status] || 'bg-slate-100 text-slate-500'}`}>
                          {lead.status || 'new'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard