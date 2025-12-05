import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FloatingBanner from '../components/common/FloatingBanner';
import { useCart } from '../context/CartContext';

// Auto-deployment test - this comment will trigger a build and deployment
const Homepage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const bestsellerScrollRef = React.useRef(null);
  const testimonialsScrollRef = React.useRef(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

  useEffect(() => {
    // Fetch featured testimonials
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials.php?featured=true`);
        const result = await response.json();
        if (result.success) {
          setTestimonials(result.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to default testimonials if API fails
        setTestimonials([
          {
            id: 1,
            name: 'Ananya Sharma',
            location: 'Mumbai, India',
            comment: 'The saree I received was breathtaking. The quality is beyond anything I\'ve found online. It was the star of the wedding!',
            rating: 5
          },
          {
            id: 2,
            name: 'Priya Kulkarni',
            location: 'Pune, India',
            comment: 'Vastrani Looms understands heritage and luxury. Their collection is curated with impeccable taste. Highly recommended.',
            rating: 5
          },
          {
            id: 3,
            name: 'Rohan Desai',
            location: 'Delhi, India',
            comment: 'I bought a gift for my mother, and she was overjoyed. The craftsmanship is truly exceptional. Thank you for preserving this art.',
            rating: 5
          }
        ]);
      }
    };
    
    // Fetch featured categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories.php`);
        const result = await response.json();
        if (result.success) {
          // Filter only featured categories and limit to 8
          const featured = result.data.filter(cat => cat.featured && cat.enabled).slice(0, 8);
          console.log('Featured Categories with images:', featured);
          setFeaturedCategories(featured);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    // Fetch bestseller products
    const fetchBestsellers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products.php?bestseller=1`);
        const result = await response.json();
        if (result.success) {
          // Get all bestseller products (no limit)
          setBestsellerProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      }
    };
    
    fetchTestimonials();
    fetchCategories();
    fetchBestsellers();
  }, [API_BASE_URL]);

  // Auto-scroll bestsellers
  useEffect(() => {
    const scrollContainer = bestsellerScrollRef.current;
    if (!scrollContainer || bestsellerProducts.length === 0) return;

    let animationId;
    let isPaused = false;
    let lastTime = Date.now();

    const autoScroll = () => {
      if (!scrollContainer) return;
      
      if (!isPaused) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        // Scroll 30 pixels per second
        const scrollAmount = (30 * deltaTime) / 1000;
        scrollContainer.scrollLeft += scrollAmount;
        
        // Reset to start when reaching the end
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      
      lastTime = Date.now();
      animationId = requestAnimationFrame(autoScroll);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
      lastTime = Date.now();
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    animationId = requestAnimationFrame(autoScroll);
    
    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [bestsellerProducts.length]);

  // Auto-scroll testimonials (right to left - appearing to come from right)
  useEffect(() => {
    const scrollContainer = testimonialsScrollRef.current;
    if (!scrollContainer || testimonials.length === 0) return;

    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    let scrollPosition = maxScroll;
    const scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollPosition -= scrollSpeed;
      
      // Reset to end when reaching the start
      if (scrollPosition <= 0) {
        scrollPosition = maxScroll;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30); // ~33fps
    
    return () => clearInterval(intervalId);
  }, [testimonials.length]);

  return (
    <>
      {/* Floating Offer Banner */}
      <FloatingBanner />
      
      {/* HeroSection */}
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="relative @container">
          <div 
            className="flex min-h-[60vh] flex-col gap-6 rounded-lg bg-cover bg-center bg-no-repeat items-center justify-center p-4" 
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("/hero-section.png")`
            }}
          >
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-wide">
                <span>Weaving a Legacy of Timeless</span>
                <br />
                <span>Elegance</span>
              </h1>
              <h2 className="text-white/90 text-lg font-body font-normal leading-normal @[480px]:text-xl">
                Experience the artistry of handcrafted sarees, a tradition passed down through generations.
              </h2>
            </div>
            <Link to="/products">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 @[480px]:h-14 @[480px]:px-8 bg-secondary text-primary text-base font-bold font-body leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors">
                <span className="truncate">Explore Our Collection</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop By Occasion */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="decorative-frame">
          <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-6">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div 
                  className="bg-cover bg-center flex flex-col justify-end p-4 aspect-[3/4] transition-transform duration-300 group-hover:scale-105" 
                  style={{
                    backgroundImage: category.image_url 
                      ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%), url("${category.image_url}")`
                      : `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%), url("/${category.slug}.png")`
                  }}
                >
                  <p className="text-white text-xl font-bold font-display leading-tight w-full text-center">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-6">
          Our Bestsellers
        </h2>
        {bestsellerProducts.length === 0 ? (
          <div className="text-center text-text-light/60 dark:text-text-dark/60 font-body py-8">
            No bestseller products available yet.
          </div>
        ) : (
          <div ref={bestsellerScrollRef} className="overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing" style={{ scrollBehavior: 'smooth' }}>
            <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
              {bestsellerProducts.map((product, index) => (
                <div key={product.id} className="relative flex-shrink-0 w-80">
                  <Link 
                    to={`/product/${product.id}`}
                    className="bg-background-light dark:bg-background-dark border border-secondary/20 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow flex flex-col h-full"
                  >
                    <div 
                      className="bg-contain bg-center bg-no-repeat w-full h-72 bg-gray-50 dark:bg-gray-900 flex-shrink-0"
                      style={{ 
                        backgroundImage: product.images && product.images.length > 0 
                          ? `url('${product.images[0].url}')` 
                          : `url('/placeholder-product.png')` 
                      }}
                    ></div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold font-display text-text-light dark:text-text-dark">{product.name}</h3>
                    <p className="font-body text-text-light/80 dark:text-text-dark/80 text-sm line-clamp-2 mb-4">
                      {product.description || 'Handwoven with care and tradition'}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-primary dark:text-secondary">₹{product.price}</span>
                        {product.sale_price && (
                          <span className="ml-2 text-sm text-text-light/60 line-through">₹{product.sale_price}</span>
                        )}
                      </div>
                      <button className="bg-primary text-white dark:bg-secondary dark:text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors whitespace-nowrap flex-shrink-0">
                        View Details
                      </button>
                    </div>
                  </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist(product);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-transform"
                    aria-label="Add to wishlist"
                  >
                    <span 
                      className={`material-symbols-outlined text-3xl drop-shadow-lg ${
                        isInWishlist(product.id) 
                          ? 'text-red-500' 
                          : 'text-white'
                      }`}
                      style={{ fontVariationSettings: isInWishlist(product.id) ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Value Proposition */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-primary/5 dark:bg-secondary/5">
        <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-8">
          Why Choose Vastrani Looms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-secondary text-5xl">
              <span className="material-symbols-outlined !text-5xl">spa</span>
            </div>
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">Handwoven Artistry</h3>
            <p className="text-text-light/80 dark:text-text-dark/80 font-body">
              Each saree is a unique piece of art, crafted by master weavers with generations of expertise.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="text-secondary text-5xl">
              <span className="material-symbols-outlined !text-5xl">verified</span>
            </div>
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">Authentic Materials</h3>
            <p className="text-text-light/80 dark:text-text-dark/80 font-body">
              We use only the finest, ethically-sourced silks, cottons, and zari for unmatched quality.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="text-secondary text-5xl">
              <span className="material-symbols-outlined !text-5xl">auto_awesome</span>
            </div>
            <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">Timeless Designs</h3>
            <p className="text-text-light/80 dark:text-text-dark/80 font-body">
              Our collections blend classic motifs with contemporary elegance, creating heirlooms for the future.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-8">
          What Our Patrons Say
        </h2>
        
        {testimonials.length > 0 ? (
          <div ref={testimonialsScrollRef} className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollBehavior: 'auto' }}>
            <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
              {/* Duplicate testimonials for seamless infinite scroll */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`${testimonial.id}-${index}`} className="decorative-frame flex-shrink-0 w-80">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`material-symbols-outlined text-xl ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        style={{fontVariationSettings: '"FILL" 1'}}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body italic text-text-light dark:text-text-dark text-center mb-4 line-clamp-4">
                    "{testimonial.comment}"
                  </p>
                  <p className="font-display font-bold text-primary dark:text-secondary text-center">
                    {testimonial.name}
                    {testimonial.location && <span className="text-sm font-normal block text-gray-600 dark:text-gray-400">{testimonial.location}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="decorative-frame">
              <p className="font-body italic text-text-light dark:text-text-dark">
                "The saree I received was breathtaking. The quality is beyond anything I've found online. It was the star of the wedding!"
              </p>
              <p className="font-display font-bold text-primary dark:text-secondary mt-4">- Ananya Sharma</p>
            </div>
            
            <div className="decorative-frame">
              <p className="font-body italic text-text-light dark:text-text-dark">
                "Vastrani Looms understands heritage and luxury. Their collection is curated with impeccable taste. Highly recommended."
              </p>
              <p className="font-display font-bold text-primary dark:text-secondary mt-4">- Priya Kulkarni</p>
            </div>
            
            <div className="decorative-frame">
              <p className="font-body italic text-text-light dark:text-text-dark">
                "I bought a gift for my mother, and she was overjoyed. The craftsmanship is truly exceptional. Thank you for preserving this art."
              </p>
              <p className="font-display font-bold text-primary dark:text-secondary mt-4">- Rohan Desai</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Homepage;