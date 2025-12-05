import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fabrics, setFabrics] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const categoryParam = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

  // Fetch fabrics on mount
  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fabrics.php`);
        const result = await response.json();
        if (result.success) {
          setFabrics(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching fabrics:', error);
      }
    };
    fetchFabrics();
  }, [API_BASE_URL]);

  // Fetch products on mount and when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/products.php`;
        const params = new URLSearchParams();
        
        if (categoryParam) {
          params.append('category', categoryParam);
        }
        if (collectionParam) {
          params.append('collection', collectionParam);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryParam, collectionParam, API_BASE_URL]);

  // Generate dynamic heading
  const getHeading = () => {
    if (categoryParam) {
      return `Our ${categoryParam} Saree Collection`;
    }
    if (collectionParam) {
      return `Our ${collectionParam} Collection`;
    }
    return 'Our Saree Collections';
  };

  const productCategories = [
    {
      title: "Banarasi Silk Sarees",
      description: "Luxurious silk sarees with intricate gold and silver brocade work",
      image: "/banarasi-collection.jpg",
      priceRange: "$400 - $800"
    },
    {
      title: "Kanchipuram Silk Sarees",
      description: "Traditional temple border sarees with rich colors and motifs",
      image: "/kanchipuram-collection.jpg",
      priceRange: "$450 - $900"
    },
    {
      title: "Chanderi Cotton Sarees",
      description: "Lightweight, comfortable sarees perfect for daily wear",
      image: "/chanderi-collection.jpg",
      priceRange: "$150 - $350"
    },
    {
      title: "Tussar Silk Sarees",
      description: "Natural textured silk sarees with earthy elegance",
      image: "/tussar-collection.jpg",
      priceRange: "$200 - $500"
    },
    {
      title: "Wedding Collection",
      description: "Exquisite bridal sarees for your special day",
      image: "/wedding-collection.jpg",
      priceRange: "$600 - $1200"
    },
    {
      title: "Festival Collection",
      description: "Vibrant sarees perfect for celebrations",
      image: "/festival-collection.jpg",
      priceRange: "$250 - $600"
    }
  ];

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-primary dark:text-secondary text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-tight tracking-[-0.015em] text-center mb-3 sm:mb-4">
          {getHeading()}
        </h1>
        <p className="text-center text-text-light/80 dark:text-text-dark/80 font-body text-sm sm:text-base mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
          Discover our curated collections of handwoven sarees, each piece crafted with love and attention to detail. 
          From traditional silk to contemporary cotton, find your perfect saree.
        </p>
        
        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center">
          {/* Fabric Filter */}
          <select
            value={selectedFabric}
            onChange={(e) => setSelectedFabric(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body font-semibold focus:ring-2 focus:ring-secondary focus:border-transparent min-w-[120px] sm:min-w-[160px]"
          >
            <option value="all">Fabric</option>
            {fabrics.map((fabric) => (
              <option key={fabric} value={fabric.toLowerCase()}>{fabric}</option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body font-semibold focus:ring-2 focus:ring-secondary focus:border-transparent min-w-[120px] sm:min-w-[160px]"
          >
            <option value="all">Colour</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="pink">Pink</option>
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="gold">Gold</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body font-semibold focus:ring-2 focus:ring-secondary focus:border-transparent min-w-[120px] sm:min-w-[160px]"
          >
            <option value="featured">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary"></div>
            <p className="mt-4 text-text-light dark:text-text-dark font-body">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">inventory_2</span>
            <p className="text-text-light/60 dark:text-text-dark/60 font-body">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="relative bg-background-light dark:bg-background-dark border border-secondary/20 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div 
                  className="bg-contain bg-center bg-no-repeat w-full h-80 transition-transform duration-300 group-hover:scale-105 bg-gray-50 dark:bg-gray-900 flex-shrink-0"
                  style={{ 
                    backgroundImage: product.images && product.images.length > 0 
                      ? `url('${product.images[0].url.startsWith('http') ? product.images[0].url : 'https://seashell-yak-534067.hostingersite.com/' + product.images[0].url}')` 
                      : 'linear-gradient(135deg, #F5E6D3 0%, #D4AF37 100%)'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist(product);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-transform z-10"
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
                <div className="p-3">
                  <h3 className="text-sm font-bold font-display text-text-light dark:text-text-dark mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="font-body text-text-light/80 dark:text-text-dark/80 mb-2 text-xs line-clamp-1">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-base font-bold text-primary dark:text-secondary">
                        ₹{parseFloat(product.price).toLocaleString()}
                      </span>
                      {product.sale_price && (
                        <span className="ml-1 text-xs text-gray-500 line-through">
                          ₹{parseFloat(product.sale_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-primary text-white dark:bg-secondary dark:text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors w-full block text-center">
                    View Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ display: 'none' }}>
          {productCategories.map((category, index) => (
            <div key={index} className="bg-background-light dark:bg-background-dark border border-secondary/20 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div 
                className="bg-cover bg-center aspect-[4/3] transition-transform duration-300 group-hover:scale-105" 
                style={{ backgroundImage: `url('${category.image}')` }}
              ></div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark mb-2">
                  {category.title}
                </h3>
                <p className="font-body text-text-light/80 dark:text-text-dark/80 mb-4">
                  {category.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary dark:text-secondary">
                    {category.priceRange}
                  </span>
                  <button className="bg-primary text-white dark:bg-secondary dark:text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors">
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-primary/5 dark:bg-secondary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-4">
            Custom Orders Available
          </h2>
          <p className="font-body text-text-light dark:text-text-dark mb-6 max-w-2xl mx-auto">
            Looking for something specific? We offer custom weaving services where you can work directly 
            with our master weavers to create a unique saree tailored to your preferences.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-primary text-white dark:bg-secondary dark:text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
          >
            Inquire About Custom Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;