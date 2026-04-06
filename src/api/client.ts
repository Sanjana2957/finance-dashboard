import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Intercept requests to attach x-user-id header based on localStorage (managed by user context)
apiClient.interceptors.request.use((config) => {
  const userId = localStorage.getItem('mockUserId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});
