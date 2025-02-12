import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Single error handling in interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 500) {
      throw new Error('Internal server error. Please try again later.');
    }
    throw new Error(error.response?.data?.error || 'An error occurred while searching books');
  }
);

export const searchBooks = async (query) => {
  if (!query?.trim()) {
    throw new Error('Search query is required');
  }
  
  // Simple try-catch without duplicate error handling
  const response = await apiClient.get('/books/search', {
    params: { query: query.trim() }
  });
  return response.data;
};

export default { searchBooks };