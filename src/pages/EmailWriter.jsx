import React, { useState } from 'react'

export default function EmailWriter() {
  const [form, setForm] = useState({ persona: '', goal: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('http://localhost:4000/api/email-campaign', {
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
        <h2 className="text-lg font-semibold mb-4">Email Campaign Writer</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input required placeholder="Persona (e.g., Small business owner)" value={form.persona} onChange={e => setForm({...form, persona: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Goal (e.g., promotion)" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} className="p-2 border rounded" />
          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Result</h3>
          {result.error && <div className="text-red-600">{result.error}</div>}
          {result.subject && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600">Subject</div>
              <div className="mt-2 text-gray-800">{result.subject}</div>
            </div>
          )}
          {result.body && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600">Body</div>
              <div className="mt-2 text-gray-800 whitespace-pre-wrap">{result.body}</div>
            </div>
          )}
          {result.cta && (
            <div>
              <div className="text-sm font-medium text-gray-600">CTA</div>
              <div className="mt-2 text-indigo-700 font-medium">{result.cta}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
