import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { CartProvider } from './context/CartContext';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Addresses from './pages/Addresses';
import Settings from './pages/Settings';
import Login from './pages/Login';
import TermsConditions from './pages/TermsConditions';
import ShippingReturnPolicy from './pages/ShippingReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

// Google OAuth Client ID - Replace with your actual client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
          <ScrollToTop />
      <Routes>
        {/* Admin Route - No Header/Footer */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Login Route - No Header/Footer */}
        <Route path="/login" element={<Login />} />
        
        {/* Public Routes - With Header/Footer */}
        <Route path="*" element={
          <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body">
            <div className="layout-container flex h-full grow flex-col">
              <div className="w-full">
                <div className="layout-content-container flex flex-col w-full">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/track/:orderId?" element={<OrderTracking />} />
                      <Route path="/addresses" element={<Addresses />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/terms-conditions" element={<TermsConditions />} />
                      <Route path="/shipping-return-policy" element={<ShippingReturnPolicy />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
      </Router>
    </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;