import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import * as affiliateService from "../affiliate/affiliate.service.js";

const SECRET = process.env.JWT_SECRET || "CASHBACK_SUPER_SECRET";

const SAMPLE_PRODUCTS = [
  {
    platform: "SHOPEE",
    canonicalUrl: "https://shopee.vn/product/123456789/987654321",
    externalProductId: "987654321",
    title: "Tai nghe Bluetooth Baseus Bowie E5",
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=80",
    shopName: "Shopee",
    price: 590000,
    commissionRate: 5,
    cashbackEstimate: 29500
  },
  {
    platform: "SHOPEE",
    canonicalUrl: "https://shopee.vn/product/987654321/123456789",
    externalProductId: "123456789",
    title: "Toner cấp ẩm Some By Mi 150ml",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80",
    shopName: "Shopee",
    price: 320000,
    commissionRate: 5,
    cashbackEstimate: 16000
  },
  {
    platform: "SHOPEE",
    canonicalUrl: "https://shopee.vn/product/246813579/135792468",
    externalProductId: "135792468",
    title: "Giày Nike Air Force 1 Mid '07",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    shopName: "Shopee",
    price: 2890000,
    commissionRate: 5,
    cashbackEstimate: 144500
  },
  {
    platform: "TIKTOK",
    canonicalUrl: "https://vt.tiktok.com/ZSsampleBag",
    externalProductId: "ZSsampleBag",
    title: "Túi xách nữ thời trang Charles & Keith",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&auto=format&fit=crop&q=80",
    shopName: "TikTok Shop",
    price: 1290000,
    commissionRate: 5,
    cashbackEstimate: 64500
  }
];

const SAMPLE_NOTIFICATIONS = [
  {
    type: "LINK_CREATED",
    title: "Tạo link thành công!",
    body: "Bạn đã tạo link nhận thưởng cho Shopee thành công. Chia sẻ ngay để nhận hoàn tiền tự động.",
    tone: "pink",
    href: "/link"
  },
  {
    type: "ORDER_TRACKED",
    title: "Đơn hàng đã được ghi nhận",
    body: "Đơn hàng từ Shopee đã được ghi nhận. CashBack+ sẽ sớm xác nhận hoàn tiền cho bạn.",
    tone: "orange",
    href: "/history"
  },
  {
    type: "CASHBACK_APPROVED",
    title: "Hoàn tiền đã được duyệt!",
    body: "Bạn đã được duyệt hoàn tiền 29.500đ. Số tiền đã cộng vào ví của bạn.",
    tone: "green",
    href: "/wallet"
  }
];

export function getUserIdFromRequest(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      if (decoded?.id) return Number(decoded.id);
    } catch {
      // Guest requests still use the demo account during local development.
    }
  }

  return Number(req.query.userId || req.body?.userId || 1);
}

export function getAuthenticatedUserIdFromRequest(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded?.id ? Number(decoded.id) : null;
  } catch {
    return null;
  }
}

export async function getGuestDashboardData() {
  await seedCatalogProducts();
  await cleanupProductCacheIfNeeded();
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ accessCount: "desc" }, { updatedAt: "desc" }],
    take: 6
  });

  return {
    user: {
      id: null,
      name: "Khách",
      email: null,
      role: "GUEST",
      referralCode: null,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      bankInfo: null
    },
    membership: resolveTier(0),
    stats: [
      { key: "received", label: "Đã nhận", value: 0, valueText: formatMoney(0), tone: "green" },
      { key: "pending", label: "Đang chờ", value: 0, valueText: formatMoney(0), tone: "orange" },
      { key: "vip", label: "Thành viên thường", value: 0, valueText: "Chưa kích hoạt", tone: "gray" },
      { key: "friends", label: "Bạn bè hợp lệ", value: 0, valueText: "0", tone: "purple" }
    ],
    unreadNotifications: 0,
    recentProducts: products.map(formatProduct)
  };
}

export async function ensureUser(userId = 1) {
  const existing = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      id: Number(userId),
      name: "Vũ Văn Cường",
      email: `demo${userId}@cashbackplus.vn`,
      available_balance: 1250000,
      pending_balance: 320000,
      total_earned: 1250000,
      current_exp: 1250000,
      referral_code: "CBP123456"
    }
  });
}

export async function seedUserHome(userId = 1) {
  const user = await ensureUser(userId);

  await prisma.userMembership.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, tier: resolveTier(user.total_earned).key, exp: user.total_earned }
  });

  await seedCatalogProducts();

  const existingNotifications = await prisma.notification.count({ where: { userId: user.id } });
  if (existingNotifications === 0) {
    await prisma.notification.createMany({
      data: SAMPLE_NOTIFICATIONS.map((item, index) => ({
        ...item,
        userId: user.id,
        createdAt: new Date(Date.now() - index * 30 * 60 * 1000)
      }))
    });
  }

  return user;
}

export async function seedCatalogProducts() {
  for (const product of SAMPLE_PRODUCTS) {
    await prisma.product.upsert({
      where: { canonicalUrl: product.canonicalUrl },
      update: {},
      create: {
        ...product,
        accessCount: 1,
        lastCrawledAt: new Date(),
        lastAccessedAt: new Date(),
        expiresAt: addHours(new Date(), 24)
      }
    });
  }
}

export function resolveTier(totalEarned = 0) {
  if (totalEarned >= 15000000) return { key: "DIAMOND", label: "VIP Kim Cương", bonusRate: 6, nextExp: null, tone: "diamond" };
  if (totalEarned >= 5000000) return { key: "GOLD", label: "VIP Vàng", bonusRate: 4, nextExp: 15000000, tone: "gold" };
  if (totalEarned >= 1000000) return { key: "SILVER", label: "VIP Bạc", bonusRate: 2, nextExp: 5000000, tone: "silver" };
  if (totalEarned >= 250000) return { key: "BRONZE", label: "VIP Đồng", bonusRate: 1, nextExp: 1000000, tone: "bronze" };
  return { key: "NORMAL", label: "Thành viên thường", bonusRate: 0, nextExp: 250000, tone: "gray" };
}

export async function getDashboardData(userId) {
  const user = await seedUserHome(userId);
  await cleanupProductCacheIfNeeded();
  const tier = resolveTier(user.total_earned);
  const [products, unreadNotifications, referralCount] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ lastAccessedAt: "desc" }, { createdAt: "desc" }],
      take: 6
    }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
    prisma.user.count({ where: { referred_by: user.id } })
  ]);

  return {
    user: formatUser(user),
    membership: tier,
    stats: [
      { key: "received", label: "Đã nhận", value: user.available_balance, valueText: formatMoney(user.available_balance), tone: "green" },
      { key: "pending", label: "Đang chờ", value: user.pending_balance, valueText: formatMoney(user.pending_balance), tone: "orange" },
      { key: "vip", label: tier.label, value: tier.bonusRate, valueText: tier.key === "NORMAL" ? "Bắt đầu tích lũy" : "Ưu đãi đặc biệt", tone: tier.tone },
      { key: "friends", label: "Bạn bè hợp lệ", value: referralCount, valueText: String(referralCount || 8), tone: "purple" }
    ],
    unreadNotifications,
    recentProducts: products.map(formatProduct)
  };
}

export async function listProducts({ userId, limit = 20, platform }) {
  if (userId) await seedUserHome(userId);
  else await seedCatalogProducts();
  await cleanupProductCacheIfNeeded();

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(platform ? { platform } : {})
    },
    orderBy: [{ accessCount: "desc" }, { updatedAt: "desc" }],
    take: Math.min(Number(limit) || 20, 50)
  });

  return products.map(formatProduct);
}

export async function resolveProductForUser({ userId, originUrl }) {
  const user = await seedUserHome(userId);
  await cleanupProductCacheIfNeeded();
  const cleanUrl = normalizeUrl(originUrl);

  const cached = await prisma.product.findUnique({ where: { canonicalUrl: cleanUrl } });
  if (cached && cached.expiresAt && cached.expiresAt > new Date()) {
    const product = await touchProductAccess({ userId: user.id, product: cached, sourceUrl: originUrl });
    return {
      fromCache: true,
      product: formatProduct(product),
      affiliateUrl: await getLatestAffiliateUrl({ userId: user.id, productId: product.id, fallbackUrl: cleanUrl })
    };
  }

  const converted = await affiliateService.convertLink({
    originUrl: cleanUrl,
    subId1: `user_${user.id}`
  });

  const platform = converted.platform || affiliateService.detectPlatform(cleanUrl).key;
  const productPayload = {
    platform,
    externalProductId: extractExternalProductId(cleanUrl),
    canonicalUrl: cleanUrl,
    title: converted.productName || "Sản phẩm hoàn tiền",
    imageUrl: converted.productImage || converted.image || null,
    shopName: converted.shopName || converted.platformName || null,
    price: Number(converted.rawPrice || parseMoney(converted.price)) || null,
    commissionRate: parseRate(converted.commissionRate),
    cashbackEstimate: parseMoney(converted.estimatedCommission),
    accessCount: { increment: 1 },
    lastCrawledAt: new Date(),
    lastAccessedAt: new Date(),
    expiresAt: addHours(new Date(), platform === "SHOPEE" ? 12 : 24),
    status: converted.hasCommission === false ? "NO_COMMISSION" : "ACTIVE"
  };

  const product = await prisma.product.upsert({
    where: { canonicalUrl: cleanUrl },
    update: productPayload,
    create: {
      ...productPayload,
      accessCount: 1
    }
  });

  const affiliateUrl = converted.affiliateUrl || cleanUrl;
  await Promise.all([
    prisma.productAccess.create({ data: { userId: user.id, productId: product.id, sourceUrl: originUrl } }),
    prisma.affiliateLink.create({
      data: {
        userId: user.id,
        productId: product.id,
        platform,
        originUrl: cleanUrl,
        affiliateUrl
      }
    }),
    prisma.notification.create({
      data: {
        userId: user.id,
        type: "LINK_CREATED",
        title: "Tạo link thành công!",
        body: `Bạn đã tạo link nhận thưởng cho ${formatPlatform(platform)} thành công.`,
        tone: "pink",
        href: "/link"
      }
    })
  ]);

  return {
    fromCache: false,
    product: formatProduct(product),
    affiliateUrl,
    raw: converted
  };
}

export async function listNotifications(userId, { unreadOnly = false } = {}) {
  if (!userId) return [];
  await seedUserHome(userId);
  const items = await prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { readAt: null } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return items.map(formatNotification);
}

export async function markNotificationRead(userId, id) {
  await prisma.notification.updateMany({
    where: { id: Number(id), userId },
    data: { readAt: new Date() }
  });
  const item = await prisma.notification.findFirst({ where: { id: Number(id), userId } });
  if (!item) throw new Error("Không tìm thấy thông báo");
  return formatNotification(item);
}

export async function getMembership(userId) {
  if (!userId) {
    const current = resolveTier(0);
    return {
      current,
      exp: 0,
      nextExp: current.nextExp,
      tiers: getMembershipTiers()
    };
  }

  const user = await seedUserHome(userId);
  const current = resolveTier(user.total_earned);
  return {
    current,
    exp: user.total_earned,
    nextExp: current.nextExp,
    tiers: getMembershipTiers()
  };
}

function getMembershipTiers() {
  return [
    { key: "NORMAL", label: "Thường", minExp: 0, bonusRate: 0, tone: "gray" },
    { key: "BRONZE", label: "VIP Đồng", minExp: 250000, bonusRate: 1, tone: "bronze" },
    { key: "SILVER", label: "VIP Bạc", minExp: 1000000, bonusRate: 2, tone: "silver" },
    { key: "GOLD", label: "VIP Vàng", minExp: 5000000, bonusRate: 4, tone: "gold" },
    { key: "DIAMOND", label: "VIP Kim Cương", minExp: 15000000, bonusRate: 6, tone: "diamond" }
  ];
}

export async function cleanupProductCacheIfNeeded() {
  const maxProducts = Number(process.env.PRODUCT_CACHE_MAX || 5000);
  const pruneBatchSize = Number(process.env.PRODUCT_CACHE_PRUNE_BATCH || 200);
  const total = await prisma.product.count();

  if (total <= maxProducts) return { deleted: 0, total };

  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const staleProducts = await prisma.product.findMany({
    where: {
      accessCount: { lt: 3 },
      lastAccessedAt: { lt: cutoff },
      affiliateLinks: { none: {} }
    },
    orderBy: [{ lastAccessedAt: "asc" }, { createdAt: "asc" }],
    take: pruneBatchSize,
    select: { id: true }
  });

  if (staleProducts.length === 0) return { deleted: 0, total };

  const result = await prisma.product.deleteMany({
    where: { id: { in: staleProducts.map((item) => item.id) } }
  });

  return { deleted: result.count, total };
}

async function touchProductAccess({ userId, product, sourceUrl }) {
  const [updated] = await Promise.all([
    prisma.product.update({
      where: { id: product.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date()
      }
    }),
    prisma.productAccess.create({
      data: { userId, productId: product.id, sourceUrl }
    })
  ]);
  return updated;
}

async function getLatestAffiliateUrl({ userId, productId, fallbackUrl }) {
  const link = await prisma.affiliateLink.findFirst({
    where: { userId, productId },
    orderBy: { createdAt: "desc" }
  });
  return link?.affiliateUrl || fallbackUrl;
}

function normalizeUrl(originUrl) {
  if (!originUrl || typeof originUrl !== "string") {
    throw new Error("Thiếu link sản phẩm");
  }
  const value = originUrl.trim();
  const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
  parsed.hash = "";
  return parsed.toString();
}

function extractExternalProductId(url) {
  const productMatch = url.match(/(?:product|i)\D+(\d+)\D+(\d+)/i);
  if (productMatch) return productMatch[2];
  const numbers = url.match(/\d{6,}/g);
  return numbers?.at(-1) || null;
}

function parseMoney(value) {
  if (typeof value === "number") return Math.round(value);
  if (!value) return null;
  const match = String(value).match(/[\d.,]+/);
  if (!match) return null;
  const normalized = match[0].replace(/[.,]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRate(value) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const match = String(value).replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0)) + "đ";
}

function formatPlatform(platform) {
  if (platform === "TIKTOK") return "TikTok Shop";
  if (platform === "LAZADA") return "Lazada";
  return "Shopee";
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    referralCode: user.referral_code,
    availableBalance: user.available_balance,
    pendingBalance: user.pending_balance,
    totalEarned: user.total_earned,
    bankInfo: user.bankInfo
  };
}

function formatProduct(product) {
  return {
    id: product.id,
    platform: product.platform,
    platformName: formatPlatform(product.platform),
    title: product.title,
    name: product.title,
    imageUrl: product.imageUrl,
    image: product.imageUrl,
    shopName: product.shopName,
    price: product.price,
    priceText: product.price ? formatMoney(product.price) : "Xem giá khi mở app",
    cashbackEstimate: product.cashbackEstimate,
    cashbackText: product.cashbackEstimate ? formatMoney(product.cashbackEstimate) : "Tính tự động",
    commissionRate: product.commissionRate,
    canonicalUrl: product.canonicalUrl,
    accessCount: product.accessCount,
    lastAccessedAt: product.lastAccessedAt,
    updatedAt: product.updatedAt
  };
}

function formatNotification(item) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    text: item.body,
    body: item.body,
    tone: item.tone,
    href: item.href,
    read: Boolean(item.readAt),
    createdAt: item.createdAt,
    timeText: relativeTime(item.createdAt)
  };
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
