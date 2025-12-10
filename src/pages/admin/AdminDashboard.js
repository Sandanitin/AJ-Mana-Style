import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '../../components/admin/ProductManagement';
import CategoryManagement from '../../components/admin/CategoryManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import CustomerManagement from '../../components/admin/CustomerManagement';
import Analytics from '../../components/admin/Analytics';
import OfferBanner from '../../components/admin/OfferBanner';
import FAQManagement from '../../components/admin/FAQManagement';
import Payments from '../../components/admin/Payments';
import Shipping from '../../components/admin/Shipping';
import Reviews from '../../components/admin/Reviews';
import Testimonials from '../../components/admin/Testimonials';
import NewsletterManagement from '../../components/admin/NewsletterManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Optional: Check if user is admin (if you have role field)
    // if (parsedUser.role !== 'admin') {
    //   navigate('/');
    //   return;
    // }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    // Redirect to login page
    navigate('/login');
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'products', label: 'Product Management', icon: 'inventory_2' },
    { id: 'categories', label: 'Category & Collections', icon: 'category' },
    { id: 'orders', label: 'Order Management', icon: 'shopping_bag' },
    { id: 'customers', label: 'Customer Management', icon: 'group' },
    { id: 'offers', label: 'Offer Banners', icon: 'campaign' },
    { id: 'faqs', label: 'FAQ Management', icon: 'help' },
    { id: 'payments', label: 'Payments', icon: 'payment' },
    { id: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { id: 'reviews', label: 'Reviews', icon: 'star' },
    { id: 'testimonials', label: 'Testimonials', icon: 'format_quote' },
    { id: 'newsletter', label: 'Newsletter', icon: 'mail' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'offers':
        return <OfferBanner />;
      case 'faqs':
        return <FAQManagement />;
      case 'payments':
        return <Payments />;
      case 'shipping':
        return <Shipping />;
      case 'reviews':
        return <Reviews />;
      case 'testimonials':
        return <Testimonials />;
      case 'newsletter':
        return <NewsletterManagement />;
      default:
        return <Analytics />;
    }
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light dark:text-text-dark font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#F5E6D3] dark:bg-primary/90 text-primary dark:text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-primary/20 dark:border-white/10 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-primary text-secondary rounded-full border border-secondary">
                <span className="font-display font-bold text-xs">AJ</span>
              </div>
              <span className="font-display font-bold text-secondary">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-primary/10 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-secondary">
              {isSidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === item.id
                  ? 'bg-secondary text-primary font-bold'
                  : 'text-primary/80 dark:text-white/90 hover:bg-primary/10 dark:hover:bg-white/10'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {isSidebarOpen && <span className="font-body text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary/20 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-primary/80 dark:text-white/90 hover:bg-primary/10 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span className="font-body text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-secondary/20 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-display font-bold text-primary dark:text-secondary">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-primary/10 dark:hover:bg-secondary/10 rounded-full transition-colors">
              <span className="material-symbols-outlined text-primary dark:text-secondary">notifications</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary dark:text-secondary">person</span>
              </div>
              <div>
                <p className="text-sm font-body font-semibold text-text-light dark:text-text-dark">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-text-light/60 dark:text-text-dark/60">{user?.email || 'admin@vastranilooms.com'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
