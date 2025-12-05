const API_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

export const offerBannerService = {
    // Get all banners (admin)
    getAllBanners: async () => {
        try {
            const response = await fetch(`${API_URL}/offer-banners.php`);
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
            }
            
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('Error fetching offer banners:', error);
            throw error;
        }
    },

    // Get active banner (for homepage)
    getActiveBanner: async () => {
        try {
            const response = await fetch(`${API_URL}/offer-banners.php?active=1`);
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = JSON.parse(text);
            // Return the data array from the response
            return result.data || [];
        } catch (error) {
            console.error('Error fetching active banner:', error);
            throw error;
        }
    },

    // Create new banner
    createBanner: async (bannerData) => {
        try {
            const response = await fetch(`${API_URL}/offer-banners.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bannerData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating banner:', error);
            throw error;
        }
    },

    // Update banner
    updateBanner: async (bannerData) => {
        try {
            const response = await fetch(`${API_URL}/offer-banners.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bannerData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating banner:', error);
            throw error;
        }
    },

    // Delete banner
    deleteBanner: async (id) => {
        try {
            const response = await fetch(`${API_URL}/offer-banners.php?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting banner:', error);
            throw error;
        }
    }
};
