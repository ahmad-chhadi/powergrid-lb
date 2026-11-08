import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="*" element={<h1 className="container-page py-20 text-4xl font-extrabold">PowerGrid LB</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}