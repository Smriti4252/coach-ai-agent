import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ fontFamily: "'Cormorant Garamond', serif" }}
      className="bg-white border-b border-stone-100 px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-lg font-semibold tracking-widest text-stone-800 uppercase text-sm">
          Coach AI
        </span>
      </div>
      <div className="flex gap-8 text-xs tracking-widest uppercase text-stone-400">
        <Link to="/" className="hover:text-stone-800 transition duration-300">Get Started</Link>
        <Link to="/dashboard" className="hover:text-stone-800 transition duration-300">Dashboard</Link>
      </div>
    </nav>
  )
}

export default Navbar