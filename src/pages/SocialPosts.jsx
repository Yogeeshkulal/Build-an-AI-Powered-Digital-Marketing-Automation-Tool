import React, { useState } from 'react'

export default function SocialPosts() {
  const [form, setForm] = useState({ businessType: '', product: '', tone: '', audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('http://localhost:4000/api/social-posts', {
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
        <h2 className="text-lg font-semibold mb-4">Social Media Generator</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input required placeholder="Business Type" value={form.businessType} onChange={e => setForm({...form, businessType: e.target.value})} className="p-2 border rounded" />
          <input required placeholder="Product" value={form.product} onChange={e => setForm({...form, product: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Tone (friendly, professional)" value={form.tone} onChange={e => setForm({...form, tone: e.target.value})} className="p-2 border rounded" />
          <input placeholder="Audience" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="p-2 border rounded" />
          <div className="md:col-span-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Result</h3>
          {result.error && <div className="text-red-600">{result.error}</div>}
          {result.linkedin && (
            <div className="space-y-4">
              <div className="p-4 border rounded bg-gray-50">
                <div className="text-sm font-medium text-gray-600">LinkedIn</div>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap">{result.linkedin}</div>
              </div>
              <div className="p-4 border rounded bg-pink-50">
                <div className="text-sm font-medium text-gray-600">Instagram</div>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap">{result.instagram}</div>
              </div>
              <div className="p-4 border rounded bg-blue-50">
                <div className="text-sm font-medium text-gray-600">Twitter</div>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap">{result.twitter}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
