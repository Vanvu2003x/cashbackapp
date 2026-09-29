import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getDashboardData,
  getAuthenticatedUserIdFromRequest,
  getGuestDashboardData,
  getMembership,
  getUserIdFromRequest,
  listNotifications,
  listProducts,
  markNotificationRead,
  resolveProductForUser,
  seedUserHome
} from "./user.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  const data = userId ? await getDashboardData(userId) : await getGuestDashboardData();
  res.json({ success: true, data });
});

export const getProducts = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  const data = await listProducts({
    userId,
    limit: req.query.limit,
    platform: req.query.platform
  });
  res.json({ success: true, data });
});

export const resolveProduct = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Bạn cần đăng nhập để tạo link hoàn tiền"
    });
  }

  const data = await resolveProductForUser({
    userId,
    originUrl: req.body.originUrl
  });
  res.json({ success: true, data });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  const data = await listNotifications(userId, {
    unreadOnly: req.query.unreadOnly === "true"
  });
  res.json({
    success: true,
    data,
    unreadCount: data.filter((item) => !item.read).length
  });
});

export const readNotification = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: "Bạn cần đăng nhập để đọc thông báo" });
  }
  const data = await markNotificationRead(userId, req.params.id);
  res.json({ success: true, data });
});

export const getUserMembership = asyncHandler(async (req, res) => {
  const userId = getAuthenticatedUserIdFromRequest(req);
  const data = await getMembership(userId);
  res.json({ success: true, data });
});

export const bootstrapUser = asyncHandler(async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const user = await seedUserHome(userId);
  res.json({ success: true, data: user });
});
