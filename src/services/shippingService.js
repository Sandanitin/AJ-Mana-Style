const API_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

export const shippingService = {
    // Get all shipping zones
    getAllZones: async () => {
        try {
            const response = await fetch(`${API_URL}/shipping.php`);
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
            }
            
            try {
                const data = JSON.parse(text);
                return data;
            } catch (parseError) {
                console.error('Failed to parse JSON:', text);
                throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
            }
        } catch (error) {
            console.error('Error fetching shipping zones:', error);
            throw error;
        }
    },

    // Create new shipping zone
    createZone: async (zoneData) => {
        try {
            const response = await fetch(`${API_URL}/shipping.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(zoneData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating shipping zone:', error);
            throw error;
        }
    },

    // Update shipping zone
    updateZone: async (zoneData) => {
        try {
            const response = await fetch(`${API_URL}/shipping.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(zoneData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating shipping zone:', error);
            throw error;
        }
    },

    // Delete shipping zone
    deleteZone: async (id) => {
        try {
            const response = await fetch(`${API_URL}/shipping.php?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting shipping zone:', error);
            throw error;
        }
    },

    // Calculate shipping charge based on pincode and order total
    calculateShipping: async (pincode, orderTotal) => {
        try {
            const response = await fetch(`${API_URL}/shipping.php`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch shipping zones');
            }

            const zones = data.data;
            
            // Find matching zone for the pincode
            for (const zone of zones) {
                if (zone.pincodes === 'All India') {
                    // This is the fallback zone
                    continue;
                }
                
                // Check if pincode matches range
                const ranges = zone.pincodes.split(',').map(r => r.trim());
                for (const range of ranges) {
                    if (range.includes('-')) {
                        const [start, end] = range.split('-').map(p => parseInt(p));
                        const pin = parseInt(pincode);
                        if (pin >= start && pin <= end) {
                            const charge = orderTotal >= parseFloat(zone.free_above) ? 0 : parseFloat(zone.charge);
                            return {
                                zone: zone.zone_name,
                                charge: charge,
                                deliveryTime: zone.delivery_time,
                                freeAbove: parseFloat(zone.free_above)
                            };
                        }
                    } else if (range === pincode) {
                        const charge = orderTotal >= parseFloat(zone.free_above) ? 0 : parseFloat(zone.charge);
                        return {
                            zone: zone.zone_name,
                            charge: charge,
                            deliveryTime: zone.delivery_time,
                            freeAbove: parseFloat(zone.free_above)
                        };
                    }
                }
            }
            
            // If no specific zone found, use "All India" zone
            const defaultZone = zones.find(z => z.pincodes === 'All India');
            if (defaultZone) {
                const charge = orderTotal >= parseFloat(defaultZone.free_above) ? 0 : parseFloat(defaultZone.charge);
                return {
                    zone: defaultZone.zone_name,
                    charge: charge,
                    deliveryTime: defaultZone.delivery_time,
                    freeAbove: parseFloat(defaultZone.free_above)
                };
            }
            
            throw new Error('No shipping zone found');
        } catch (error) {
            console.error('Error calculating shipping:', error);
            throw error;
        }
    }
};
