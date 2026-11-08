import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Providers from './pages/Providers'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
<Route path="/" element={<Home />} />
<Route path="/providers" element={<Providers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}