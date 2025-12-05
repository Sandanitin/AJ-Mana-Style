import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
  
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'products', label: 'Products' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'returns', label: 'Returns' },
    { value: 'care', label: 'Care Instructions' },
    { value: 'ordering', label: 'Ordering' }
  ];

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/faqs.php?active=true`);
      const result = await response.json();
      if (result.success) {
        setFaqs(result.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setNewsletterMessage('Please enter your email');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setNewsletterMessage('Please enter a valid email');
      return;
    }
    
    setIsSubscribing(true);
    setNewsletterMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewsletterMessage('Thank you for subscribing! 🎉');
        setEmail('');
      } else {
        setNewsletterMessage(result.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setNewsletterMessage(''), 5000);
    }
  };

  useEffect(() => {
    if (showFAQModal) {
      fetchFAQs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFAQModal]);

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <>
    <footer className="bg-primary/10 dark:bg-secondary/10 px-4 sm:px-6 lg:px-8 py-10 mt-10">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 sm:size-12 md:size-14">
              <img 
                src="/Logo_Transparent.png" 
                alt="Vastrani Looms Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold font-display text-primary dark:text-secondary">Vastrani Looms</h3>
          </div>
          <p className="font-body text-sm text-text-light/80 dark:text-text-dark/80">
            Celebrating the timeless art of Indian handloom weaving. A legacy of elegance for the modern woman.
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-lg font-bold font-display text-text-light dark:text-text-dark mb-4">Quick Links</h3>
          <ul className="space-y-2 font-body text-sm">
            <li><Link className="hover:text-secondary" to="/">Home</Link></li>
            <li><Link className="hover:text-secondary" to="/products">Shop Now</Link></li>
            <li><Link className="hover:text-secondary" to="/about">About Us</Link></li>
            <li><Link className="hover:text-secondary" to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-lg font-bold font-display text-text-light dark:text-text-dark mb-4">Customer Service</h3>
          <ul className="space-y-2 font-body text-sm">
            <li><Link to="/privacy-policy" className="hover:text-secondary">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-secondary">Terms & Conditions</Link></li>
            <li><Link to="/shipping-return-policy" className="hover:text-secondary">Shipping & Return Policy</Link></li>
            <li><Link to="/cancellation-refund-policy" className="hover:text-secondary">Cancellation & Refunds</Link></li>
            <li><button onClick={() => setShowFAQModal(true)} className="hover:text-secondary text-left">FAQs</button></li>
          </ul>
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-lg font-bold font-display text-text-light dark:text-text-dark mb-4">Stay Connected</h3>
          <p className="font-body text-sm text-text-light/80 dark:text-text-dark/80 mb-3">
            Subscribe to our newsletter for exclusive offers and updates!
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mb-2">
            <div className="flex">
              <input 
                className="w-full rounded-l-lg border border-secondary/30 bg-background-light dark:bg-background-dark focus:ring-secondary focus:border-secondary h-9 text-sm px-3" 
                placeholder="Your Email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-primary text-white dark:bg-secondary dark:text-primary px-3 rounded-r-lg font-bold hover:bg-primary/90 dark:hover:bg-secondary/90 h-9 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {newsletterMessage && (
              <p className={`text-xs mt-2 ${newsletterMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                {newsletterMessage}
              </p>
            )}
          </form>
          <div className="flex gap-3 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 dark:bg-secondary/10 hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 dark:bg-secondary/10 hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 dark:bg-secondary/10 hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm mt-10 pt-6 border-t border-secondary/30">
        <p>© 2024 <a href="/" className="font-bold hover:text-primary dark:hover:text-secondary transition-colors">Vastrani Looms</a>. All Rights Reserved. | Designed and Developed by <a href="https://www.vikrin.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">Vikrin</a></p>
      </div>
    </footer>

    {/* FAQ Modal */}
    {showFAQModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFAQModal(false)}>
        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-primary/20 dark:border-secondary/20 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-2">Frequently Asked Questions</h2>
              <p className="text-sm font-body text-text-light/70 dark:text-text-dark/70">Find answers to common questions about our products and services</p>
            </div>
            <button 
              onClick={() => setShowFAQModal(false)}
              className="p-2 hover:bg-primary/10 dark:hover:bg-secondary/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-primary dark:text-secondary">close</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="px-6 py-4 bg-primary/5 dark:bg-secondary/5 border-b border-primary/20 dark:border-secondary/20">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-white dark:bg-secondary dark:text-primary'
                      : 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-primary/10 dark:hover:bg-secondary/10 border border-primary/30 dark:border-secondary/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary mx-auto"></div>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-primary/30 dark:text-secondary/30 mb-4 block">help</span>
                <p className="font-body text-text-light/70 dark:text-text-dark/70">No FAQs found in this category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border border-primary/20 dark:border-secondary/20 rounded-lg overflow-hidden decorative-frame"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-4 flex justify-between items-center hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="material-symbols-outlined text-primary dark:text-secondary mt-1">
                          help
                        </span>
                        <div className="flex-1">
                          <h3 className="font-semibold font-display text-text-light dark:text-text-dark">
                            {faq.question}
                          </h3>
                          <span className="text-xs text-text-light/60 dark:text-text-dark/60 mt-1 inline-block capitalize font-body">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-primary dark:text-secondary transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 pt-0 pl-14 font-body text-text-light dark:text-text-dark whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;