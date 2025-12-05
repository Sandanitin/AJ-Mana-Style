import React, { useState, useEffect } from 'react';
import { dataStore } from '../../data/catalogData';

// API Base URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    collection_id: '',
    fabric: '',
    bestseller: false,
    colors: [],
    images: []
  });

  const [colorInput, setColorInput] = useState({ name: '', code: '#800000' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload-image.php`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  // Load products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products.php?include_disabled=true`);
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data || []);
      } else {
        console.error('Failed to fetch products:', result.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories, collections and fabrics on mount
  useEffect(() => {
    const updateData = () => {
      setCategories(dataStore.getAllCategories());
      setCollections(dataStore.getAllCollections());
    };
    
    const fetchFabrics = async () => {
      try {
        console.log('Fetching fabrics from:', `${API_BASE_URL}/fabrics.php`);
        const response = await fetch(`${API_BASE_URL}/fabrics.php`);
        const result = await response.json();
        console.log('Fabrics response:', result);
        if (result.success) {
          setFabrics(result.data || []);
          console.log('Fabrics set:', result.data);
        }
      } catch (error) {
        console.error('Error fetching fabrics:', error);
      }
    };
    
    updateData();
    fetchProducts();
    fetchFabrics();
    
    const unsubscribe = dataStore.subscribe(updateData);
    
    return () => unsubscribe();
  }, []);

  const handleAddColor = () => {
    if (colorInput.name && colorInput.code) {
      const newColor = { name: colorInput.name, code: colorInput.code, id: Date.now() };
      setFormData(prevData => ({
        ...prevData,
        colors: [...prevData.colors, newColor]
      }));
      setColorInput({ name: '', code: '#800000' });
    }
  };

  const handleRemoveColor = (colorId) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(color => color.id !== colorId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploadingImage(true);
      
      // Upload all images to server first
      const uploadedImages = [];
      for (const img of formData.images) {
        if (img.file) {
          // New image file that needs to be uploaded
          const uploadedUrl = await uploadImage(img.file);
          uploadedImages.push({
            url: uploadedUrl,
            alt_text: img.alt_text || formData.name,
            display_order: img.display_order
          });
        } else if (img.url) {
          // Existing image URL (for edit mode)
          uploadedImages.push({
            url: img.url,
            alt_text: img.alt_text || formData.name,
            display_order: img.display_order
          });
        }
      }
      
      setUploadingImage(false);
      
      const url = editingProduct 
        ? `${API_BASE_URL}/products.php`
        : `${API_BASE_URL}/products.php`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        id: editingProduct?.id,
        images: uploadedImages,
        // Convert string values to numbers
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock: parseInt(formData.stock) || 0,
        category_id: parseInt(formData.category_id),
        collection_id: formData.collection_id ? parseInt(formData.collection_id) : null
      };
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        
        // Close modal and reset form
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          sale_price: '',
          stock: '',
          category_id: '',
          collection_id: '',
          fabric: '',
          bestseller: false,
          colors: [],
          images: []
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      stock: product.stock || '',
      category_id: product.category_id || '',
      collection_id: product.collection_id || '',
      fabric: product.fabric || '',
      bestseller: product.bestseller || false,
      colors: product.colors || [],
      images: product.images || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Refresh products list
          await fetchProducts();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-bold text-primary dark:text-secondary">Products</h2>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">Manage your saree products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              sale_price: '',
              stock: '',
              category_id: '',
              collection_id: '',
              fabric: '',
              bestseller: false,
              colors: [],
              images: []
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary dark:bg-secondary text-white dark:text-primary px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/10 dark:bg-secondary/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Colors</th>
                    <th className="px-6 py-3 text-right text-xs font-body font-bold text-primary dark:text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-text-light/60 dark:text-text-dark/60 font-body">
                        No products added yet. Click "Add Product" to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-primary/5 dark:hover:bg-secondary/5">
                        <td className="px-3 py-2">
                          <div className="font-body text-xs font-semibold text-text-light dark:text-text-dark">{product.name}</div>
                          <div className="text-[10px] text-text-light/60 dark:text-text-dark/60">{product.collection_name || '-'}</div>
                        </td>
                        <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">
                          ₹{product.price}
                          {product.sale_price && (
                            <span className="ml-2 text-[10px] text-secondary line-through">₹{product.sale_price}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{product.stock}</td>
                        <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{product.category_name || '-'}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            {product.colors && product.colors.slice(0, 3).map((color, idx) => (
                              <div
                                key={color.id || idx}
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: color.code }}
                                title={color.name}
                              />
                            ))}
                            {product.colors && product.colors.length > 3 && (
                              <span className="text-xs text-text-light/60 dark:text-text-dark/60">+{product.colors.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-primary dark:text-secondary hover:text-primary/70 dark:hover:text-secondary/70"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {products.length === 0 ? (
                <div className="px-4 py-8 text-center text-text-light/60 dark:text-text-dark/60 font-body">
                  No products added yet. Click "Add Product" to get started.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-body font-semibold text-text-light dark:text-text-dark">{product.name}</div>
                        <div className="text-sm text-text-light/60 dark:text-text-dark/60">{product.collection_name || '-'}</div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-primary dark:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">Price:</span>
                        <span className="ml-1 font-semibold">₹{product.price}</span>
                      </div>
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">Stock:</span>
                        <span className="ml-1 font-semibold">{product.stock}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-text-light/60 dark:text-text-dark/60">Category:</span>
                        <span className="ml-1">{product.category_name || '-'}</span>
                      </div>
                    </div>
                    
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-text-light/60 dark:text-text-dark/60 mr-1">Colors:</span>
                        {product.colors.slice(0, 5).map((color, idx) => (
                          <div
                            key={color.id || idx}
                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-text-light/60 dark:text-text-dark/60">+{product.colors.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-display font-bold text-primary dark:text-secondary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Collection
                  </label>
                  <select
                    value={formData.collection_id}
                    onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  >
                    <option value="">Select Collection</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fabric Dropdown */}
              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Fabric *
                </label>
                <select
                  required
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                >
                  <option value="">Select Fabric</option>
                  {fabrics.map((fabric) => (
                    <option key={fabric} value={fabric}>{fabric}</option>
                  ))}
                </select>
              </div>

              {/* Bestseller Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={formData.bestseller}
                  onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="bestseller" className="text-sm font-body font-semibold text-text-light dark:text-text-dark cursor-pointer">
                  Mark as Bestseller (will appear in homepage bestsellers section)
                </label>
              </div>

              {/* Color Management */}
              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Available Colors
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Color name"
                    value={colorInput.name}
                    onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                  <input
                    type="color"
                    value={colorInput.code}
                    onChange={(e) => setColorInput({ ...colorInput, code: e.target.value })}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-primary rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <div
                      key={color.id}
                      className="flex items-center gap-2 bg-primary/10 dark:bg-secondary/10 px-3 py-2 rounded-lg"
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="text-sm font-body text-text-light dark:text-text-dark">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Product Images (Max 4)
                </label>
                
                {/* Image Preview Grid */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {formData.images && formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <img src={img.url || URL.createObjectURL(img.file)} alt={img.alt_text || 'Product'} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Image Button - show only if less than 4 images */}
                  {(!formData.images || formData.images.length < 4) && (
                    <div 
                      className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-secondary transition-colors"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                      <span className="text-xs text-gray-500 mt-1">Add Image</span>
                    </div>
                  )}
                </div>
                
                <input 
                  id="image-upload"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const currentImages = formData.images || [];
                    const remainingSlots = 4 - currentImages.length;
                    
                    if (remainingSlots <= 0) {
                      alert('Maximum 4 images allowed');
                      return;
                    }
                    
                    const filesToAdd = files.slice(0, remainingSlots);
                    const newImages = filesToAdd.map((file, idx) => ({
                      file: file,
                      url: URL.createObjectURL(file),
                      alt_text: formData.name || 'Product image',
                      display_order: currentImages.length + idx
                    }));
                    
                    setFormData(prev => ({
                      ...prev,
                      images: [...currentImages, ...newImages]
                    }));
                    
                    // Reset input
                    e.target.value = '';
                  }}
                />
                
                <p className="text-xs text-text-light/60 dark:text-text-dark/60 mt-2">
                  Upload up to 4 product images. First image will be the primary image.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-2 bg-primary dark:bg-secondary text-white dark:text-primary rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading Images...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
