const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("authToken");

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "API request failed");
  }

  return data;
};

export const api = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getShops: () => request("/shops"),
  createShop: (payload) =>
    request("/shops", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createProduct: (payload) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getShopProducts: (shopId) => request(`/shop/${shopId}/products`),
  getProductAnalytics: (productId) => request(`/products/${productId}/analytics`),
  getProductSentiment: (productId) => request(`/products/${productId}/sentiment`),
  getProductReport: (productId) => request(`/products/${productId}/report`),
  getProductTrends: (productId) => request(`/products/${productId}/trends`),
  submitReview: (payload) =>
    request("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const authStorage = {
  getToken,
  setToken: (token) => localStorage.setItem("authToken", token),
  clearToken: () => localStorage.removeItem("authToken"),
};
