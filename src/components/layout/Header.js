import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom';
import { dataStore } from '../../data/catalogData';
import { useCart } from '../../context/CartContext';
import ProfileModal from '../common/ProfileModal';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [mobileProfileExpanded, setMobileProfileExpanded] = useState(false);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const { getCartCount, wishlistItems } = useCart();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes (when user data is updated)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUser);
      }
    };

    // Listen for custom event when user data changes
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // Load and subscribe to data changes
  useEffect(() => {
    const updateData = () => {
      setCollections(dataStore.getCollections().map(c => c.name));
      setCategories(dataStore.getCategories().map(c => c.name));
    };

    updateData();
    const unsubscribe = dataStore.subscribe(updateData);

    return () => unsubscribe();
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsShopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsShopDropdownOpen(false);
    }, 200); // 200ms delay to allow cursor movement
    setHoverTimeout(timeout);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsProfileDropdownOpen(false);
    window.location.href = '/';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-secondary/30 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 md:py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 hover:opacity-80 transition-opacity">
          <div className="size-12 sm:size-14 md:size-14">
            <div className="w-full h-full flex items-center justify-center bg-primary text-white rounded-full border-2 border-secondary shadow-sm">
              <span className="font-display font-bold text-lg sm:text-xl">AJ</span>
            </div>
          </div>
          <h2 className="text-primary dark:text-secondary text-xl sm:text-2xl md:text-2xl font-bold font-display leading-tight tracking-[-0.015em]">
            AJ-Mana Style
          </h2>
        </Link>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-6 xl:gap-9">
          <Link className="text-text-light dark:text-text-dark text-xs lg:text-sm font-medium font-body leading-normal hover:text-secondary" to="/">Home</Link>

          {/* Shop Now Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              className="text-text-light dark:text-text-dark text-xs lg:text-sm font-medium font-body leading-normal hover:text-secondary flex items-center gap-1"
              to="/products"
              onClick={() => setIsShopDropdownOpen(false)}
            >
              Shop Now
              <span className="material-symbols-outlined text-xs lg:text-sm">keyboard_arrow_down</span>
            </Link>

            {/* Simple Dropdown */}
            {isShopDropdownOpen && (
              <div
                className="absolute top-full left-0 w-48 bg-background-light dark:bg-background-dark border border-secondary/30 rounded-lg shadow-xl z-50 py-2"
                style={{ marginTop: '0.5rem' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/products?category=men"
                  onClick={() => setIsShopDropdownOpen(false)}
                  className="block px-4 py-2 text-sm font-body text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 hover:text-secondary transition-colors"
                >
                  Men
                </Link>
                <Link
                  to="/products?category=women"
                  onClick={() => setIsShopDropdownOpen(false)}
                  className="block px-4 py-2 text-sm font-body text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 hover:text-secondary transition-colors"
                >
                  Women
                </Link>
                <Link
                  to="/products?category=kids"
                  onClick={() => setIsShopDropdownOpen(false)}
                  className="block px-4 py-2 text-sm font-body text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 hover:text-secondary transition-colors"
                >
                  Kids
                </Link>
                <Link
                  to="/products?category=footwear"
                  onClick={() => setIsShopDropdownOpen(false)}
                  className="block px-4 py-2 text-sm font-body text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 hover:text-secondary transition-colors"
                >
                  Footwear
                </Link>
              </div>
            )}
          </div>

          <Link className="text-text-light dark:text-text-dark text-xs lg:text-sm font-medium font-body leading-normal hover:text-secondary" to="/about">About Us</Link>
          <Link className="text-text-light dark:text-text-dark text-xs lg:text-sm font-medium font-body leading-normal hover:text-secondary" to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop Icons - Always visible on desktop */}

          {/* Profile/Login Icon */}
          {user ? (
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/10 dark:to-secondary/5 hover:from-primary/20 hover:to-primary/10 dark:hover:from-secondary/20 dark:hover:to-secondary/10 transition-all duration-200 border border-primary/20 dark:border-secondary/20"
              >
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 text-white dark:text-primary font-bold text-[10px] shadow-md">
                  {getInitials(user.name)}
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-[8px] text-text-light/60 dark:text-text-dark/60 font-medium uppercase tracking-wide leading-tight">Profile</div>
                  <div className="text-[11px] font-semibold text-text-light dark:text-text-dark leading-tight">{user.name.split(' ')[0]}</div>
                </div>
                <span className="material-symbols-outlined text-sm text-text-light/70 dark:text-text-dark/70">
                  {isProfileDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-background-light dark:bg-background-dark border border-primary/20 dark:border-secondary/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gradient-to-br from-primary/5 to-transparent dark:from-secondary/5 dark:to-transparent border-b border-primary/10 dark:border-secondary/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 text-white dark:text-primary font-bold text-lg shadow-lg">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-text-light dark:text-text-dark">{user.name}</div>
                          <div className="text-xs text-text-light/60 dark:text-text-dark/60 truncate max-w-[140px]">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 transition-all duration-200 group w-full text-left"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary dark:text-secondary">person</span>
                        </div>
                        <span>My Profile</span>
                      </button>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary dark:text-secondary">shopping_bag</span>
                        </div>
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/addresses"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary dark:text-secondary">location_on</span>
                        </div>
                        <span>My Addresses</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary dark:text-secondary">settings</span>
                        </div>
                        <span>Settings</span>
                      </Link>

                      {/* Divider */}
                      <div className="my-2 px-5">
                        <div className="border-t border-primary/10 dark:border-secondary/10"></div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left group"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                          <span className="material-symbols-outlined text-lg text-red-600 dark:text-red-400">logout</span>
                        </div>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20">
              <span className="material-symbols-outlined text-2xl">person</span>
            </Link>
          )}

          <Link to="/wishlist" className="hidden md:flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20 relative">
            <span className="material-symbols-outlined text-2xl">favorite</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="hidden md:flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20 relative">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Menu */}
          <button
            className="md:hidden flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 w-9 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu - Slides from Left */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setMobileShopExpanded(false);
              setMobileExpandedSection(null);
            }}
          />

          {/* Main Menu Sidebar - Slides from Left */}
          <div className="md:hidden fixed top-0 left-0 h-full w-[300px] bg-background-light dark:bg-background-dark z-50 shadow-2xl animate-slideInLeft overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-between items-center p-5 border-b border-secondary/30">
              <h3 className="text-2xl font-display font-bold text-primary dark:text-secondary">Menu</h3>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileShopExpanded(false);
                  setMobileExpandedSection(null);
                }}
                className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Mobile Icons Section */}
            <div className="flex justify-around gap-4 p-5 border-b border-secondary/20 bg-gradient-to-br from-primary/5 to-transparent dark:from-secondary/5 dark:to-transparent">
              {user ? (
                <button
                  onClick={() => setMobileProfileExpanded(!mobileProfileExpanded)}
                  className="flex flex-col items-center gap-2 text-text-light dark:text-text-dark hover:text-secondary"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 text-white dark:text-primary font-bold text-base shadow-lg">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-xs font-semibold">{user.name.split(' ')[0]}</span>
                </button>
              ) : (
                <Link to="/login" className="flex flex-col items-center gap-2 text-text-light dark:text-text-dark hover:text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 dark:bg-secondary/10">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <span className="text-xs font-body">Account</span>
                </Link>
              )}
              <Link to="/wishlist" className="flex flex-col items-center gap-2 text-text-light dark:text-text-dark hover:text-secondary relative" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 dark:bg-secondary/10 relative">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-body">Wishlist</span>
              </Link>
              <Link to="/cart" className="flex flex-col items-center gap-2 text-text-light dark:text-text-dark hover:text-secondary relative" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 dark:bg-secondary/10 relative">
                  <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border-2 border-background-light dark:border-background-dark">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span className="text-xs font-body">Cart</span>
              </Link>
            </div>

            {/* User Profile Section (Mobile) - Only show when expanded */}
            {user && mobileProfileExpanded && (
              <div className="p-5 border-b border-secondary/20 bg-gradient-to-br from-primary/5 to-transparent dark:from-secondary/5 dark:to-transparent">
                <div className="mb-3 pb-3 border-b border-secondary/10">
                  <div className="text-xs text-text-light/60 dark:text-text-dark/60 uppercase tracking-wide mb-1 font-semibold">Account</div>
                  <div className="text-sm font-medium text-text-light/80 dark:text-text-dark/80 truncate">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileProfileExpanded(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="flex items-center gap-4 py-3 text-text-light dark:text-text-dark hover:text-secondary transition-colors group w-full text-left"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl text-primary dark:text-secondary">person</span>
                  </div>
                  <span className="text-base font-body font-medium">My Profile</span>
                </button>
                <Link
                  to="/orders"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileProfileExpanded(false);
                  }}
                  className="flex items-center gap-4 py-3 text-text-light dark:text-text-dark hover:text-secondary transition-colors group"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl text-primary dark:text-secondary">shopping_bag</span>
                  </div>
                  <span className="text-base font-body font-medium">My Orders</span>
                </Link>
                <Link
                  to="/addresses"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileProfileExpanded(false);
                  }}
                  className="flex items-center gap-4 py-3 text-text-light dark:text-text-dark hover:text-secondary transition-colors group"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl text-primary dark:text-secondary">location_on</span>
                  </div>
                  <span className="text-base font-body font-medium">My Addresses</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileProfileExpanded(false);
                  }}
                  className="flex items-center gap-4 py-3 text-text-light dark:text-text-dark hover:text-secondary transition-colors group"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 dark:bg-secondary/10 group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl text-primary dark:text-secondary">settings</span>
                  </div>
                  <span className="text-base font-body font-medium">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 py-3 text-red-600 dark:text-red-400 w-full text-left group mt-2"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </div>
                  <span className="text-base font-body font-medium">Log Out</span>
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col p-5">
              <Link
                className="text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4 border-b border-secondary/10"
                to="/"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileShopExpanded(false);
                  setMobileExpandedSection(null);
                }}
              >
                Home
              </Link>

              {/* Shop Now Button */}
              <button
                className="text-left text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary flex items-center justify-between py-4 border-b border-secondary/10"
                onClick={() => setMobileShopExpanded(true)}
              >
                <span>Shop Now</span>
                <span className="material-symbols-outlined text-xl">keyboard_arrow_right</span>
              </button>

              <Link
                className="text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4 border-b border-secondary/10"
                to="/about"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileShopExpanded(false);
                  setMobileExpandedSection(null);
                }}
              >
                About Us
              </Link>
              <Link
                className="text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4"
                to="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileShopExpanded(false);
                  setMobileExpandedSection(null);
                }}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Shop Menu Sidebar - Slides from Right */}
          {mobileShopExpanded && (
            <div className="md:hidden fixed top-0 right-0 h-full w-[300px] bg-background-light dark:bg-background-dark z-50 shadow-2xl animate-slideInRight overflow-y-auto">
              {/* Header with Back Button */}
              <div className="flex items-center gap-3 p-5 border-b border-secondary/30">
                <button
                  onClick={() => {
                    setMobileShopExpanded(false);
                    setMobileExpandedSection(null);
                  }}
                  className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 dark:bg-secondary/10 text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-secondary/20"
                >
                  <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h3 className="text-2xl font-display font-bold text-primary dark:text-secondary">Shop</h3>
              </div>

              {/* Shop Content - Simple Links */}
              <div className="p-5">
                <div className="space-y-2">
                  <Link
                    className="block text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4 border-b border-secondary/10"
                    to="/products?category=men"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileShopExpanded(false);
                    }}
                  >
                    Men
                  </Link>
                  <Link
                    className="block text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4 border-b border-secondary/10"
                    to="/products?category=women"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileShopExpanded(false);
                    }}
                  >
                    Women
                  </Link>
                  <Link
                    className="block text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4 border-b border-secondary/10"
                    to="/products?category=kids"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileShopExpanded(false);
                    }}
                  >
                    Kids
                  </Link>
                  <Link
                    className="block text-text-light dark:text-text-dark text-lg font-medium font-body leading-normal hover:text-secondary py-4"
                    to="/products?category=footwear"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileShopExpanded(false);
                    }}
                  >
                    Footwear
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;