import React, { useState, useEffect } from 'react';
import { offerBannerService } from '../../services/offerBannerService';

const FloatingBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveBanners();
  }, []);

  useEffect(() => {
    // Add padding to body when banner is visible
    if (banners.length > 0 && isVisible) {
      document.body.style.paddingTop = '44px';
    } else {
      document.body.style.paddingTop = '0';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [banners, isVisible]);

  const loadActiveBanners = async () => {
    try {
      setLoading(true);
      const response = await offerBannerService.getActiveBanner();
      console.log('Banner API Response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        // Get all active banners
        console.log('Active Banners Found:', response.data);
        setBanners(response.data);
        setIsVisible(true);
      } else {
        console.log('No active banners found in response');
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    // Just hide the banner temporarily (only for this page view)
    setIsVisible(false);
  };

  const handleCopyCoupon = (couponCode) => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || banners.length === 0 || !isVisible) {
    return null;
  }

  // Use the first banner's colors for the entire banner bar
  const primaryBanner = banners[0];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] shadow-md px-4 py-2.5 flex items-center justify-between overflow-hidden"
      style={{
        backgroundColor: primaryBanner.bg_color,
        color: primaryBanner.text_color
      }}
    >
      {/* Banner Content with Scrolling Animation */}
      <div className="flex-1 flex items-center overflow-hidden">
        <div 
          className="flex items-center gap-8 whitespace-nowrap"
          style={{
            animation: 'scroll 30s linear infinite'
          }}
        >
          {/* Repeat content 3 times for seamless loop */}
          {[...Array(3)].map((_, repeatIndex) => (
            <React.Fragment key={`repeat-${repeatIndex}`}>
              {banners.map((banner, index) => (
                <React.Fragment key={`${repeatIndex}-${banner.id}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">🎉</span>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm md:text-base">{banner.title}</p>
                      {banner.type === 'coupon' && banner.coupon_code && (
                        <>
                          <span className="hidden md:inline text-sm opacity-90">|</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs md:text-sm opacity-90">Code:</span>
                            <code className="px-2 py-0.5 rounded text-xs md:text-sm font-mono font-bold border border-current bg-white/10">
                              {banner.coupon_code}
                            </code>
                            <button
                              onClick={() => handleCopyCoupon(banner.coupon_code)}
                              className="text-xs underline hover:opacity-80 transition-opacity"
                              title="Copy coupon code"
                            >
                              {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                          </div>
                        </>
                      )}
                      {banner.min_order_amount > 0 && (
                        <span className="text-xs md:text-sm opacity-90">
                          (Min order: ₹{banner.min_order_amount})
                        </span>
                      )}
                    </div>
                  </div>
                  {(repeatIndex < 2 || index < banners.length - 1) && (
                    <span className="text-2xl opacity-50 mx-4">•</span>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}} />
    </div>
  );
};

export default FloatingBanner;
