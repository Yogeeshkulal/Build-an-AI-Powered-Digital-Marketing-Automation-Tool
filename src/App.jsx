import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SocialPosts from './pages/SocialPosts'
import AdCopy from './pages/AdCopy'
import EmailWriter from './pages/EmailWriter'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<SocialPosts />} />
          <Route path="/ad-copy" element={<AdCopy />} />
          <Route path="/email" element={<EmailWriter />} />
        </Routes>
      </main>
    </div>
  )
}
