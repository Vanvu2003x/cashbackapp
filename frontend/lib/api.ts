const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  authProvider?: string;
  role?: string;
  referralCode?: string;
};

export type Profile = {
  id: string | null;
  userId: string;
  gmail: string;
  fullName: string | null;
  displayName: string | null;
  avatar: string | null;
  phone: string | null;
  dob: string | null;
  gender: string;
  bio: string | null;
  address: string | null;
  referralCode: string;
};

export type Wallet = {
  id: string;
  userId: string;
  currentBalance: number;
  totalReceived: number;
  totalWithdrawn: number;
};

export type Bank = {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo?: string;
};

export type BankAccount = {
  id: string;
  userId: string;
  bankCode: string;
  bankBin?: string | null;
  bankName: string;
  bankShortName?: string | null;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
};

export type AffiliateLinkResult = {
  provider: string;
  originUrl: string;
  affiliateUrl: string;
  subIds: string[];
  commission?: {
    sharePercent: number;
    displayed: {
      rate: number | null;
      amount: number | null;
    };
  };
};

export type ProductOffer = {
  itemId?: string;
  shopId?: string;
  productName?: string;
  shopName?: string;
  imageUrl?: string;
  productLink?: string;
  offerLink?: string;
  commission?: {
    sharePercent: number;
    displayed: {
      rate: number | null;
      amount: number | null;
    };
  };
};

export type UserProduct = {
  id: number;
  platform: "SHOPEE" | "TIKTOK" | "LAZADA" | "OTHER";
  platformName: string;
  title: string;
  name: string;
  imageUrl?: string | null;
  image?: string | null;
  shopName?: string | null;
  price?: number | null;
  priceText: string;
  cashbackEstimate?: number | null;
  cashbackText: string;
  commissionRate?: number | null;
  canonicalUrl: string;
};

export type DashboardStat = {
  key: string;
  label: string;
  value: number;
  valueText: string;
  tone: string;
};

export type Membership = {
  key: string;
  label: string;
  bonusRate: number;
  nextExp: number | null;
  tone: string;
};

export type DashboardData = {
  user: {
    id: number;
    name: string;
    email?: string | null;
    referralCode?: string | null;
    availableBalance: number;
    pendingBalance: number;
    totalEarned: number;
  };
  membership: Membership;
  stats: DashboardStat[];
  unreadNotifications: number;
  recentProducts: UserProduct[];
};

export type UserNotification = {
  id: number;
  type: string;
  title: string;
  text: string;
  body: string;
  tone: string;
  href?: string | null;
  read: boolean;
  createdAt: string;
  timeText: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token") || window.localStorage.getItem("token");
}

export function setToken(token: string) {
  window.localStorage.setItem("auth_token", token);
  window.localStorage.setItem("token", token);
}

export function clearToken() {
  window.localStorage.removeItem("auth_token");
  window.localStorage.removeItem("token");
}

export async function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string, name: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function getCurrentProfile() {
  return request<{ data: Profile }>("/api/users/me", {
    headers: authHeaders(),
  });
}

export async function getCurrentAuthUser() {
  return request<AuthUser>("/api/auth/me", {
    headers: authHeaders(),
  });
}

export async function updateProfile(data: Partial<Profile>) {
  return request<{ data: Profile }>("/api/users/me", {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function getWallet() {
  return request<{ data: Wallet }>("/api/wallet", {
    headers: authHeaders(),
  });
}

export async function getBanks() {
  return request<{ data: Bank[] }>("/api/wallet/banks", {
    headers: authHeaders(),
  });
}

export async function getBankAccounts() {
  return request<{ data: BankAccount[] }>("/api/wallet/bank-accounts", {
    headers: authHeaders(),
  });
}

export async function createBankAccount(data: {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}) {
  return request<{ data: BankAccount }>("/api/wallet/bank-accounts", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteBankAccount(id: string) {
  return request<void>(`/api/wallet/bank-accounts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function createAffiliateLink(originUrl: string) {
  return request<{ data: AffiliateLinkResult }>("/api/affiliate/links", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ originUrl }),
  });
}

export async function getUserDashboard() {
  return request<{ success: boolean; data: DashboardData }>("/api/user/dashboard", {
    headers: authHeaders(),
  });
}

export async function getUserProducts(limit = 20) {
  return request<{ success: boolean; data: UserProduct[] }>(`/api/user/products?limit=${limit}`, {
    headers: authHeaders(),
  });
}

export async function resolveUserProduct(originUrl: string) {
  return request<{
    success: boolean;
    data: {
      fromCache: boolean;
      affiliateUrl: string;
      product: UserProduct;
      raw?: Record<string, unknown>;
    };
  }>("/api/user/products/resolve", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ originUrl }),
  });
}

export async function getUserNotifications() {
  return request<{ success: boolean; data: UserNotification[]; unreadCount: number }>("/api/user/notifications", {
    headers: authHeaders(),
  });
}

export async function getShopeeOffers(keyword: string) {
  const params = new URLSearchParams({
    keyword,
    page: "1",
    limit: "10",
  });

  return request<{ data: { nodes: ProductOffer[] } }>(`/api/shopee/product-offers?${params}`, {
    headers: authHeaders(),
  });
}

function authHeaders(): Record<string, string> {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}) {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}
