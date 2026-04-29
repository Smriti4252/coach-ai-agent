import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LeadForm from './pages/LeadForm'
import Booking from './pages/Booking'
import Proposal from './pages/Proposal'
import Dashboard from './pages/Dashboard'
import ThankYou from './pages/ThankYou'



function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<LeadForm />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App