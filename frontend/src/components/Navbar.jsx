import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#1e3a5f' }}>
          <span className="text-white text-xs font-bold">CA</span>
        </div>
        <span className="text-lg font-semibold text-gray-800"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          Coach<span style={{ color: '#1e3a5f' }}>AI</span>
        </span>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-800 transition duration-200">
          Get Started
        </Link>
        <Link to="/dashboard"
          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition duration-200 hover:opacity-90"
          style={{ backgroundColor: '#1e3a5f' }}>
          Dashboard
        </Link>
      </div>
    </nav>
  )
}

export default Navbar