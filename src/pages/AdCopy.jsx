import React, { useState } from 'react'
import { API_BASE } from '../config/api'

export default function AdCopy() {
  const [form, setForm] = useState({ description: '', audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/ad-copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Ad Copy Creator</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Audience" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="p-2 border rounded" />
          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Result</h3>
          {result.error && <div className="text-red-600">{result.error}</div>}
          {result.headlines && Array.isArray(result.headlines) && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600">Headlines</div>
              <ul className="list-disc list-inside mt-2">
                {result.headlines.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}
          {result.adText && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600">Ad Text</div>
              <div className="mt-2 text-gray-800 whitespace-pre-wrap">{result.adText}</div>
            </div>
          )}
          {result.ctas && Array.isArray(result.ctas) && (
            <div>
              <div className="text-sm font-medium text-gray-600">CTAs</div>
              <div className="mt-2 flex gap-2">
                {result.ctas.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-100 rounded">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
