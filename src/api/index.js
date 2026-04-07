import AsyncStorage from '@react-native-async-storage/async-storage';

// export const BASE_URL = 'http://192.168.0.112:5000/api';

export const BASE_URL = 'http://10.0.2.2:5000/api';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

const request = async (method, endpoint, body = null, requiresAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const authAPI = {
  signup: (body) => request('POST', '/auth/signup', body, false),
  login: (PhoneNumber) => request('POST', '/auth/login', { PhoneNumber }, false),
  verifyOTP: (PhoneNumber, otp) => request('POST', '/auth/verify-otp', { PhoneNumber, otp }, false),
  getProfile: () => request('GET', '/auth/profile'),
  updateProfile: (body) => request('PUT', '/auth/profile', body),
};


export const productAPI = {
  getAll: (category, search) => {
    let endpoint = '/products';
    const params = [];
    if (category && category !== 'All') params.push(`category=${category}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) endpoint += '?' + params.join('&');
    return request('GET', endpoint);
  },
  getById: (id) => request('GET', `/products/${id}`),
  seed: () => request('POST', '/products/seed', {}, false),
};

export const cartAPI = {
  get: () => request('GET', '/cart'),
  add: (productId, quantity) => request('POST', '/cart/add', { productId, quantity }),
  update: (itemId, quantity) => request('PUT', `/cart/item/${itemId}`, { quantity }),
  remove: (itemId) => request('DELETE', `/cart/item/${itemId}`),
  clear: () => request('DELETE', '/cart/clear'),
};

export const orderAPI = {
  place: (deliveryAddress, paymentMethod) =>
    request('POST', '/orders', { deliveryAddress, paymentMethod }),
  getAll: (filter) => request('GET', `/orders${filter ? `?filter=${filter}` : ''}`),
  getById: (id) => request('GET', `/orders/${id}`),
};
