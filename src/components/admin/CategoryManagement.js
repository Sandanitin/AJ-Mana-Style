import React, { useState, useEffect } from 'react';
import { dataStore } from '../../data/catalogData';

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load data on mount and subscribe to changes
  useEffect(() => {
    const updateData = () => {
      setCategories(dataStore.getAllCategories());
      setCollections(dataStore.getAllCollections());
    };
    
    updateData();
    const unsubscribe = dataStore.subscribe(updateData);
    
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage && activeTab === 'categories') {
        imageUrl = await uploadImage(selectedImage);
      }
      
      if (activeTab === 'categories') {
        await dataStore.addCategory(itemName, imageUrl);
      } else {
        await dataStore.addCollection(itemName);
      }
      
      setIsModalOpen(false);
      setItemName('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      alert('Failed to add item: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setImagePreview(item.image_url || null);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = editingItem.image_url;
      
      // Upload new image if selected
      if (selectedImage && activeTab === 'categories') {
        console.log('Uploading new image...');
        imageUrl = await uploadImage(selectedImage);
        console.log('New image URL:', imageUrl);
      }
      
      if (activeTab === 'categories') {
        const updates = { name: itemName };
        if (selectedImage || imageUrl) {
          updates.image_url = imageUrl;
        }
        console.log('Updating category with:', updates);
        await dataStore.updateCategory(editingItem.id, updates);
      } else {
        await dataStore.updateCollection(editingItem.id, { name: itemName });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setItemName('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update item: ' + error.message);
    }
  };
  
  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Uploading image...', file.name);
      
      const response = await fetch('https://seashell-yak-534067.hostingersite.com/backend/api/upload-image.php', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      console.log('Upload result:', result);
      
      if (result.success) {
        const imageUrl = result.url || result.data?.url;
        console.log('Image uploaded successfully:', imageUrl);
        return imageUrl;
      } else {
        throw new Error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? It will be removed from the Shop Now menu.')) {
      try {
        if (activeTab === 'categories') {
          await dataStore.deleteCategory(id);
        } else {
          await dataStore.deleteCollection(id);
        }
      } catch (error) {
        alert('Failed to delete item: ' + error.message);
      }
    }
  };

  const toggleEnabled = async (id) => {
    try {
      if (activeTab === 'categories') {
        const category = categories.find(c => c.id === id);
        await dataStore.updateCategory(id, { enabled: !category.enabled });
      } else {
        const collection = collections.find(c => c.id === id);
        await dataStore.updateCollection(id, { enabled: !collection.enabled });
      }
    } catch (error) {
      alert('Failed to toggle status: ' + error.message);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      // Count current featured categories
      const featuredCount = categories.filter(c => c.featured).length;
      const category = categories.find(c => c.id === id);
      
      // If trying to feature and already have 8, prevent it
      if (!category.featured && featuredCount >= 8) {
        alert('You can only feature up to 8 categories on the homepage. Please unfeature another category first.');
        return;
      }
      
      await dataStore.updateCategory(id, { featured: !category.featured });
    } catch (error) {
      alert('Failed to toggle featured: ' + error.message);
    }
  };

  const currentItems = activeTab === 'categories' ? categories : collections;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-body font-semibold border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-primary dark:border-secondary text-primary dark:text-secondary'
                : 'border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 font-body font-semibold border-b-2 transition-colors ${
              activeTab === 'collections'
                ? 'border-primary dark:border-secondary text-primary dark:text-secondary'
                : 'border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark'
            }`}
          >
            Collections
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-bold text-primary dark:text-secondary">
            {activeTab === 'categories' ? 'Categories' : 'Collections'}
          </h2>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">
            Manage your product {activeTab}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setItemName('');
            setSelectedImage(null);
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary dark:bg-secondary text-white dark:text-primary px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold"
        >
          <span className="material-symbols-outlined">add</span>
          Add {activeTab === 'categories' ? 'Category' : 'Collection'}
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1">
              {activeTab === 'categories' && item.image_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-primary/10 dark:bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary dark:text-secondary">
                    {activeTab === 'categories' ? 'category' : 'collections_bookmark'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-body font-semibold text-text-light dark:text-text-dark">{item.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-light/60 dark:text-text-dark/60">
                    {item.enabled ? 'Active' : 'Disabled'}
                  </p>
                  {activeTab === 'categories' && item.featured && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'categories' && (
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.featured
                      ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Toggle Featured on Homepage"
                >
                  <span className="material-symbols-outlined">
                    {item.featured ? 'star' : 'star_outline'}
                  </span>
                </button>
              )}
              <button
                onClick={() => toggleEnabled(item.id)}
                className={`p-2 rounded-lg transition-colors ${
                  item.enabled
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <span className="material-symbols-outlined">
                  {item.enabled ? 'toggle_on' : 'toggle_off'}
                </span>
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-primary dark:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-primary dark:text-secondary">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Collection'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                />
              </div>

              {activeTab === 'categories' && (
                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Category Image
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary dark:file:bg-secondary/10 dark:file:text-secondary hover:file:bg-primary/20 dark:hover:file:bg-secondary/20"
                    />
                    <p className="text-xs text-gray-500">Recommended: 400x300px, JPG or PNG</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdate : handleAdd}
                  disabled={uploading}
                  className="px-6 py-2 bg-primary dark:bg-secondary text-white dark:text-primary rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
