import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Collection } from './pages/Collection'
import { ProductPage } from './pages/Product'
import { Basket } from './pages/Basket'
import { Enquiry } from './pages/Enquiry'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/c/:slug" element={<Collection />} />
        <Route path="/p/:slug" element={<ProductPage />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/bulk-enquiry" element={<Enquiry />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
