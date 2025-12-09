import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const loc = useLocation()

  const linkClass = (path) =>
    `px-3 py-2 rounded-md ${loc.pathname === path ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-indigo-600">AI Marketing</div>
        <nav className="space-x-2">
          <Link to="/" className={linkClass('/')}>Social Media</Link>
          <Link to="/ad-copy" className={linkClass('/ad-copy')}>Ad Copy</Link>
          <Link to="/email" className={linkClass('/email')}>Email Writer</Link>
          <Link to="/chat" className={linkClass('/chat')}>AI Chat</Link>
        </nav>
      </div>
    </header>
  )
}
