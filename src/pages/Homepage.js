import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FloatingBanner from '../components/common/FloatingBanner';
import { useCart } from '../context/CartContext';

// Auto-deployment test - this comment will trigger a build and deployment
const Homepage = () => {
  const [testimonials, setTestimonials] = useState([]);
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
            comment: 'AJ-Mana Style understands heritage and luxury. Their collection is curated with impeccable taste. Highly recommended.',
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
      <section className="w-full relative">
        <div
          className="relative min-h-[90vh] flex flex-col justify-center items-start px-4 sm:px-12 lg:px-24 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url("/hero-section-v2.png")`
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent/10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-6 max-w-4xl animate-fadeIn">
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-none tracking-tight drop-shadow-lg">
              <span className="block text-secondary mb-2">The Epitome of</span>
              <span className="block">Handwoven Luxury</span>
            </h1>

            <h2 className="text-gray-200 text-lg sm:text-xl md:text-2xl font-body font-light max-w-2xl leading-relaxed drop-shadow-md">
              Authentic artistry for the modern muse. AJ-Mana Style brings you the finest selection of handcrafted sarees, detailing a legacy of perfection.
            </h2>

            <div className="mt-8">
              <Link to="/products">
                <button className="group relative overflow-hidden bg-secondary text-primary px-10 py-4 rounded-sm font-bold font-display text-lg tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Discover Our Collection
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Occasion */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="decorative-frame">
          <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-6">
            Shop All Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Men', slug: 'men', image: '/cat-men.png' },
              { name: 'Women', slug: 'women', image: '/cat-women.png' },
              { name: 'Kids', slug: 'kids', image: '/cat-kids.png' },
              { name: 'Footwear', slug: 'footwear', image: '/cat-footwear.png' }
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div
                  className="bg-cover bg-center flex flex-col justify-end p-4 aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%), url("${category.image}")`
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
          Shop New Arrivals
        </h2>
        <div ref={bestsellerScrollRef} className="overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
            {[
              {
                id: 'new-1',
                name: 'Banarasi Special',
                description: 'banarasi pattu saree made with soft silk',
                price: 3456,
                sale_price: 5678,
                image: '/arrival-banarasi.png'
              },
              {
                id: 'new-2',
                name: "Women's Paithani Soft Silk Kadiyal Maharani Saree With Blouse Piece",
                description: 'Handwoven with care and tradition',
                price: 6299,
                sale_price: 7999,
                image: '/arrival-paithani.png'
              },
              {
                id: 'new-3',
                name: 'Pure Chanderi Banarasi Silk Saree with 3D digital Print',
                description: 'Step into elegance with our Pure Chanderi Banarasi Silk Saree, featuring exquisite 3D digital print detailing.',
                price: 7399,
                sale_price: 10499,
                image: '/arrival-chanderi.png'
              },
              {
                id: 'new-4',
                name: "BFM Indian Women's LInen Woven Design Zari Border Saree",
                description: 'Elevate your ethnic wardrobe with this elegant Linen Blend Woven Design Zari Border Saree.',
                price: 3799,
                sale_price: 5299,
                image: '/women-prod-2.png' // Fallback image
              },
              {
                id: 'new-5',
                name: "Women's Peach Organza Crush Pattern Saree",
                description: 'Gorgeous Crush Pattern Completes the Saree. Lightweight and Cozy, Ideal for a Festival.',
                price: 7699,
                sale_price: 9499,
                image: '/women-prod-3.png' // Fallback image
              }
            ].map((product, index) => (
              <div key={product.id} className="relative flex-shrink-0 w-80">
                <Link 
                  to={`/product/${product.id}`}
                  className="bg-background-light dark:bg-background-dark border border-secondary/20 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div 
                    className="bg-contain bg-center bg-no-repeat w-full h-72 bg-gray-50 dark:bg-gray-900 flex-shrink-0"
                    style={{ 
                      backgroundImage: `url('${product.image}')` 
                    }}
                  ></div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold font-display text-text-light dark:text-text-dark line-clamp-2 mb-1">{product.name}</h3>
                    <p className="font-body text-text-light/80 dark:text-text-dark/80 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-primary dark:text-secondary">₹{product.price.toLocaleString()}</span>
                        {product.sale_price && (
                          <span className="ml-2 text-sm text-text-light/60 line-through">₹{product.sale_price.toLocaleString()}</span>
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
      </section>

      {/* Value Proposition */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-primary/5 dark:bg-secondary/5">
        <h2 className="text-primary dark:text-secondary text-3xl font-bold font-display leading-tight tracking-[-0.015em] text-center pb-8">
          Why Choose AJ-Mana Style
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
                        style={{ fontVariationSettings: '"FILL" 1' }}
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
                "AJ-Mana Style understands heritage and luxury. Their collection is curated with impeccable taste. Highly recommended."
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