import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RouteAdmin from './components/RouteAdmin'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Panier from './pages/Panier'
import AdminProduits from './pages/admin/AdminProduits'
import AdminLayout   from './pages/admin/AdminLayout'
import AdminBrands   from './pages/admin/AdminBrands'
import AdminVariantes from './pages/admin/AdminVariantes'
import AdminCommandes from './pages/admin/AdminCommandes'
import AdminRapports from './pages/admin/AdminRapports'

import Favoris from './pages/Favoris'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'

import MesCommandes  from './pages/MesCommandes'
import ChangePassword from './pages/ChangePassword'


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />

        {/* <Route path="/packs"   element={<Packs />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/panier"  element={<Panier />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/commandes" element={<MesCommandes />} />
        <Route path="/password"  element={<ChangePassword />} />
        {/* Route protégée admin */}
        <Route path="/admin/produits" element={
          <RouteAdmin>
            <AdminProduits />
          </RouteAdmin>
        } />
        
<Route path="/admin/produits" element={<RouteAdmin><AdminProduits /></RouteAdmin>} />
<Route path="/admin/brands"   element={<RouteAdmin><AdminBrands /></RouteAdmin>} />
<Route path="/admin/variantes" element={<RouteAdmin><AdminVariantes /></RouteAdmin>} />
<Route path="/admin/commandes" element={<RouteAdmin><AdminCommandes /></RouteAdmin>} />
<Route path="/admin/rapports"  element={<RouteAdmin><AdminRapports /></RouteAdmin>} />


      </Routes>
      <Footer />
    </BrowserRouter>
  )
}