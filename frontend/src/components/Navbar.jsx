import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold text-indigo-400">Coach AI</span>
      <div className="flex gap-6 text-sm text-gray-400">
        <Link to="/" className="hover:text-white transition">Get Started</Link>
        <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
      </div>
    </nav>
  )
}

export default Navbar