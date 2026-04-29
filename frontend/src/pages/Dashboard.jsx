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

  const scoreBadge = {
    HOT: 'text-emerald-600',
    WARM: 'text-amber-500',
    COLD: 'text-stone-400'
  }

  const statusBadge = {
    new: 'text-blue-400',
    booked: 'text-violet-500',
    proposal_sent: 'text-amber-500',
    onboarded: 'text-emerald-600'
  }

  return (
    <div className="min-h-screen bg-stone-50 px-10 py-14">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-2">Coach AI</p>
          <h1 className="text-4xl font-light text-stone-800"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Lead Dashboard
          </h1>
          <p className="text-stone-400 text-sm font-light mt-1">
            Track your pipeline and conversions in real time.
          </p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Leads', value: total },
            { label: 'Hot', value: hot, color: 'text-emerald-600' },
            { label: 'Warm', value: warm, color: 'text-amber-500' },
            { label: 'Cold', value: cold, color: 'text-stone-400' },
            { label: 'Booked', value: booked, color: 'text-violet-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-stone-100 shadow-sm p-6">
              <p className="text-xs tracking-widest uppercase text-stone-300 mb-3">{stat.label}</p>
              <p className={`text-4xl font-light ${stat.color || 'text-stone-800'}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* pipeline */}
        <div className="bg-white border border-stone-100 shadow-sm p-8 mb-8">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Pipeline Overview</p>
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs text-stone-400 mb-2">
                <span>Booking Rate</span>
                <span>{total > 0 ? Math.round((booked / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-stone-100 h-1">
                <div
                  className="bg-amber-500 h-1 transition-all duration-700"
                  style={{ width: total > 0 ? `${(booked / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-stone-400 mb-2">
                <span>Conversion Rate</span>
                <span>{total > 0 ? Math.round((onboarded / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-stone-100 h-1">
                <div
                  className="bg-emerald-500 h-1 transition-all duration-700"
                  style={{ width: total > 0 ? `${(onboarded / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="bg-white border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-stone-50 flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase text-stone-400">All Leads</p>
            <button
              onClick={fetchLeads}
              className="text-xs tracking-widest uppercase text-amber-500 hover:text-amber-600 transition"
            >
              Refresh ↻
            </button>
          </div>

          {loading && (
            <div className="text-center py-20 text-stone-300 text-xs tracking-widest uppercase">
              Loading...
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-red-300 text-xs tracking-widest uppercase">
              {error}
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div className="text-center py-20 text-stone-300 text-xs tracking-widest uppercase">
              No leads yet
            </div>
          )}

          {!loading && leads.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-50">
                  {['Name', 'Email', 'Goal', 'Budget', 'Score', 'Status'].map(h => (
                    <th key={h} className="text-left px-8 py-4 text-xs tracking-widest uppercase text-stone-300 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={i} className="border-b border-stone-50 hover:bg-stone-50 transition">
                    <td className="px-8 py-4 text-stone-700 font-medium">{lead.name}</td>
                    <td className="px-8 py-4 text-stone-400 text-xs">{lead.email}</td>
                    <td className="px-8 py-4 text-stone-500 capitalize text-xs">{lead.goal}</td>
                    <td className="px-8 py-4 text-stone-500 text-xs">{lead.budget}</td>
                    <td className="px-8 py-4">
                      <span className={`text-xs font-semibold tracking-widest uppercase ${scoreBadge[lead.score] || 'text-stone-400'}`}>
                        {lead.score || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-xs tracking-widest uppercase ${statusBadge[lead.status] || 'text-stone-400'}`}>
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