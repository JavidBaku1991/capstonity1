import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load components
const Home = lazy(() => import('./components/Home'))
const Products = lazy(() => import('./components/Products'))
const ProductDetails = lazy(() => import('./components/ProductDetails'))
const Cart = lazy(() => import('./components/Cart'))
const SignUp = lazy(() => import('./components/SignUp'))
const Login = lazy(() => import('./pages/Login'))
const AddProduct = lazy(() => import('./components/AddProduct'))
const Profile = lazy(() => import('./components/Profile'))
const Checkout = lazy(() => import('./components/Checkout'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

// Loding 
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const App = () => {
  console.log('APP - Component rendering')
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products/new" element={<AddProduct />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </Layout>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App 