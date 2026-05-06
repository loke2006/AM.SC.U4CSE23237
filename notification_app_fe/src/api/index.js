import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
  }
});

export const fetchNotifications = async (limit, page, notification_type) => {
  const params = {};
  if (limit) params.limit = limit;
  if (page) params.page = page;
  if (notification_type) params.notification_type = notification_type;
  
  const response = await api.get('', { params });
  return response.data.notifications || [];
};

export default api;
