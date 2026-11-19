const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}/api${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach auth tokens from localStorage for foolproof cross-origin compatibility
  if (typeof window !== 'undefined') {
    if (path.startsWith('/admin')) {
      const adminToken = localStorage.getItem('unsulid_admin_token');
      if (adminToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-token'] = adminToken;
      }
    } else {
      const userToken = localStorage.getItem('unsulid_session');
      if (userToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${userToken}`;
        headers['x-session-token'] = userToken;
      }
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // sends HTTP-only session cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.messages) ? data.messages.join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    sendOtp: (phone: string) =>
      request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      }),
    verifyOtp: async (phone: string, otp: string) => {
      const res = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      if (res?.token && typeof window !== 'undefined') {
        localStorage.setItem('unsulid_session', res.token);
      }
      return res;
    },
    me: () => request('/auth/me'),
    updateProfile: (data: { name?: string; email?: string }) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    logout: async () => {
      try {
        await request('/auth/logout', {
          method: 'POST',
        });
      } finally {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('unsulid_session');
        }
      }
      return { success: true };
    },
  },

  addresses: {
    list: () => request('/addresses'),
    create: (data: any) =>
      request('/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/addresses/${id}`, {
        method: 'DELETE',
      }),
    setDefault: (id: string) =>
      request(`/addresses/${id}/default`, {
        method: 'PUT',
      }),
  },

  products: {
    list: () => request('/products'),
    getBySlug: (slug: string) => request(`/products/${slug}`),
  },

  cart: {
    get: (sessionToken?: string) =>
      request('/cart', {
        headers: sessionToken ? { 'x-session-token': sessionToken } : {},
      }),
    calculate: (data: {
      items: { productId: string; quantity: number }[];
      paymentMethod?: 'PREPAID' | 'COD';
      couponCode?: string;
      pinCode?: string;
    }) =>
      request('/cart/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    merge: (items: { productId: string; quantity: number }[]) =>
      request('/cart/merge', {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
  },

  coupons: {
    apply: (code: string, subtotal: number) =>
      request('/coupons/apply', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      }),
  },

  orders: {
    create: (data: any) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    myOrders: () => request('/orders'),
    get: (id: string) => request(`/orders/${id}`),
    cancel: (id: string, reason: string) =>
      request(`/orders/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    tracking: (id: string) => request(`/orders/${id}/tracking`),
  },

  payments: {
    verifyRazorpay: (data: {
      orderId: string;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }) =>
      request('/payments/razorpay/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  settings: {
    getPublic: () => request('/settings/public'),
  },

  admin: {
    login: async (credentials: { email: string; password: string }) => {
      const res = await request('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res?.token && typeof window !== 'undefined') {
        localStorage.setItem('unsulid_admin_token', res.token);
        // Set cookie on the storefront origin so Next.js middleware and SSR can inspect it immediately
        document.cookie = `unsulid_admin_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return res;
    },
    me: () => request('/admin/auth/me'),
    logout: async () => {
      try {
        await request('/admin/auth/logout', {
          method: 'POST',
        });
      } finally {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('unsulid_admin_token');
          document.cookie = 'unsulid_admin_token=; path=/; max-age=0; SameSite=Lax';
        }
      }
      return { success: true };
    },
    getStats: () => request('/admin/dashboard/stats'),
    getProducts: () => request('/admin/products'),
    createProduct: (data: any) =>
      request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updatePrice: (slugOrId: string, data: any) =>
      request(`/admin/products/${slugOrId}/price`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteProduct: (slugOrId: string) =>
      request(`/admin/products/${slugOrId}`, {
        method: 'DELETE',
      }),
    getCoupons: () => request('/admin/coupons'),
    createCoupon: (data: any) =>
      request('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleCoupon: (id: string) =>
      request(`/admin/coupons/${id}/toggle`, {
        method: 'PUT',
      }),
    deleteCoupon: (id: string) =>
      request(`/admin/coupons/${id}`, {
        method: 'DELETE',
      }),
    updateShipping: (data: any) =>
      request('/admin/settings/shipping', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updateCod: (data: any) =>
      request('/admin/settings/cod', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updatePayments: (data: any) =>
      request('/admin/settings/payments', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updateStorefront: (data: any) =>
      request('/admin/settings/storefront', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getCustomers: (search?: string) =>
      request(`/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    toggleBlockCustomer: (id: string) =>
      request(`/admin/customers/${id}/toggle-block`, {
        method: 'PUT',
      }),
    getOrders: (params: { status?: string; paymentMethod?: string; search?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.set('status', params.status);
      if (params.paymentMethod) q.set('paymentMethod', params.paymentMethod);
      if (params.search) q.set('search', params.search);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request(`/admin/orders${queryStr}`);
    },
    updateOrderStatus: (id: string, data: any) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getAuditLogs: () => request('/admin/audit-logs'),
  },
};

