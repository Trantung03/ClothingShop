import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/home/Home'
import Shop from './pages/shop/Shop'
import Bag from './pages/bag/Bag'
import DetailPage from './pages/detailPage/DetailPage'
import Footer from './components/Footer'
import './pages/home/App.css'

function App() {
  return (
    <Router>
      <div className="page-shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
