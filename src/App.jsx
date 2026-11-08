import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Providers from './pages/Providers'
import ProviderDetails from './pages/ProviderDetails'
import Services from './pages/Services'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
<Route path="/" element={<Home />} />
<Route path="/providers" element={<Providers />} />
<Route path="/providers/:id" element={<ProviderDetails />} />
<Route path="/services" element={<Services />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}