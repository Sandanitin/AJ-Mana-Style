import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscribers'); // subscribers, campaigns, create
  const [stats, setStats] = useState({ total: 0, active: 0 });
  
  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    subject: '',
    content: '',
    type: 'promotional'
  });
  
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/newsletter.php`);
      const result = await response.json();
      
      if (result.success) {
        setSubscribers(result.data);
        const active = result.data.filter(s => s.is_active).length;
        setStats({ total: result.data.length, active });
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter.php?action=campaigns`);
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    
    if (!campaignForm.subject || !campaignForm.content) {
      setMessage('Please fill in all fields');
      return;
    }
    
    if (window.confirm(`Send newsletter to ${stats.active} active subscribers?`)) {
      setSending(true);
      setMessage('');
      
      try {
        const response = await fetch(`${API_BASE_URL}/newsletter.php?action=send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignForm)
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage(`✅ Newsletter sent to ${result.sent} subscribers!`);
          setCampaignForm({ subject: '', content: '', type: 'promotional' });
          fetchCampaigns();
          setTimeout(() => setActiveTab('campaigns'), 2000);
        } else {
          setMessage(`❌ ${result.message}`);
        }
      } catch (error) {
        setMessage('❌ Failed to send newsletter');
        console.error('Error:', error);
      } finally {
        setSending(false);
      }
    }
  };

  const emailTemplates = {
    promotional: {
      subject: 'Special Offer from Vastrani Looms',
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://seashell-yak-534067.hostingersite.com/Logo_Transparent.png" alt="Vastrani Looms" style="height: 60px;">
        </div>
        <h1 style="color: #8B4513; font-size: 24px;">Special Offer from Vastrani Looms</h1>
        <p style="font-size: 16px; line-height: 1.6;">Dear Valued Customer,</p>
        <p style="font-size: 16px; line-height: 1.6;">We're excited to offer you an exclusive discount on our handcrafted sarees!</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
          <h2 style="color: #8B4513; font-size: 28px; margin: 0;">Get 20% OFF</h2>
          <p style="font-size: 18px; margin: 10px 0;">Use code: <strong>VASTRANI20</strong></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">Visit our website to explore our latest collection of authentic handwoven sarees.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://seashell-yak-534067.hostingersite.com/products" style="display: inline-block; background: #8B4513; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Shop Now</a>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
          You're receiving this email because you subscribed to Vastrani Looms newsletter.<br>
          Vastrani Looms | Hyderabad, India<br>
          <a href="https://seashell-yak-534067.hostingersite.com/unsubscribe" style="color: #8B4513;">Unsubscribe</a>
        </p>
      </div>`
    },
    newArrival: {
      subject: 'New Collection Available at Vastrani Looms',
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://seashell-yak-534067.hostingersite.com/Logo_Transparent.png" alt="Vastrani Looms" style="height: 60px;">
        </div>
        <h1 style="color: #8B4513; font-size: 24px;">New Arrivals at Vastrani Looms</h1>
        <p style="font-size: 16px; line-height: 1.6;">Dear Customer,</p>
        <p style="font-size: 16px; line-height: 1.6;">Discover our latest handwoven sarees, crafted with tradition and elegance.</p>
        <div style="margin: 20px 0;">
          <img src="https://seashell-yak-534067.hostingersite.com/hero-section.png" style="width: 100%; max-width: 560px; border-radius: 10px;" alt="New Collection">
        </div>
        <p style="font-size: 16px; line-height: 1.6;">Each piece tells a story of heritage and craftsmanship, carefully woven by skilled artisans.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://seashell-yak-534067.hostingersite.com/products" style="display: inline-block; background: #8B4513; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Explore Collection</a>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
          You're receiving this email because you subscribed to Vastrani Looms newsletter.<br>
          Vastrani Looms | Hyderabad, India<br>
          <a href="https://seashell-yak-534067.hostingersite.com/unsubscribe" style="color: #8B4513;">Unsubscribe</a>
        </p>
      </div>`
    },
    announcement: {
      subject: 'Important Update from Vastrani Looms',
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://seashell-yak-534067.hostingersite.com/Logo_Transparent.png" alt="Vastrani Looms" style="height: 60px;">
        </div>
        <h1 style="color: #8B4513; font-size: 24px;">Update from Vastrani Looms</h1>
        <p style="font-size: 16px; line-height: 1.6;">Dear Customer,</p>
        <p style="font-size: 16px; line-height: 1.6;">[Your announcement message here]</p>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for being part of the Vastrani Looms family.</p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Warm regards,<br><strong>Team Vastrani Looms</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
          You're receiving this email because you subscribed to Vastrani Looms newsletter.<br>
          Vastrani Looms | Hyderabad, India<br>
          <a href="https://seashell-yak-534067.hostingersite.com/unsubscribe" style="color: #8B4513;">Unsubscribe</a>
        </p>
      </div>`
    }
  };

  const loadTemplate = (type) => {
    setCampaignForm({
      ...campaignForm,
      subject: emailTemplates[type].subject,
      content: emailTemplates[type].content,
      type
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-6">Newsletter Management</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Subscribers</h3>
          <p className="text-3xl font-bold text-primary dark:text-secondary mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Subscribers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Campaigns Sent</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{campaigns.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 font-semibold ${activeTab === 'subscribers' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Subscribers ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 font-semibold ${activeTab === 'campaigns' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-semibold ${activeTab === 'create' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Create Campaign
        </button>
      </div>

      {/* Content */}
      {activeTab === 'subscribers' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subscribed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 text-sm">{sub.email}</td>
                    <td className="px-6 py-4 text-sm">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${sub.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No campaigns sent yet</p>
          ) : (
            campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">{campaign.subject}</h3>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Sent: {new Date(campaign.sent_at).toLocaleString()}</span>
                  <span>Recipients: {campaign.recipients_count}</span>
                  <span className="capitalize">Type: {campaign.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
          
          {/* Quick Templates */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Quick Templates:</p>
            <div className="flex gap-2">
              <button onClick={() => loadTemplate('promotional')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                🎉 Promotional
              </button>
              <button onClick={() => loadTemplate('newArrival')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                ✨ New Arrival
              </button>
              <button onClick={() => loadTemplate('announcement')} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                📢 Announcement
              </button>
            </div>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Subject</label>
              <input
                type="text"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Your email subject..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Campaign Type</label>
              <select
                value={campaignForm.type}
                onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="promotional">Promotional</option>
                <option value="newArrival">New Arrival</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Content (HTML)</label>
              <textarea
                value={campaignForm.content}
                onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                className="w-full p-3 border rounded-lg font-mono text-sm"
                rows="15"
                placeholder="Your email HTML content..."
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
            >
              {sending ? 'Sending...' : `Send to ${stats.active} Subscribers`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;
