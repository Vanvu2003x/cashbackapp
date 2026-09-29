import { getSettings, updateSettings } from "../modules/admin/settings.controller.js";
import { requestWithdrawal } from "../modules/auth/auth.controller.js";
import { getWithdrawals, approveWithdrawal, rejectWithdrawal } from "../modules/admin/withdrawals.controller.js";
import { getConversions, approveConversion, rejectConversion } from "../modules/admin/conversions.controller.js";
import { Router } from "express";
import affiliateRoutes from "../modules/affiliate/affiliate.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import { getVipStatusFromDb } from "../config/vipConfig.js";
import { getDb } from "../config/db.js";
import prisma from "../lib/prisma.js";
import { syncShopeeConversionReports } from "../modules/affiliate/reportCron.service.js";

const router = Router();

// Health Check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);


// Cập nhật ngân hàng
router.post("/user/bank-info", async (req, res) => {
  try {
    const { userId, bankInfo } = req.body;
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { bankInfo }
    });
    res.json({ success: true, message: "Cập nhật thông tin ngân hàng thành công" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// User Withdrawal
router.post("/user/withdraw", requestWithdrawal);

// VIP status API (Đọc cấu hình động từ SQLite DB)
router.get("/user/vip-status", async (req, res) => {
  try {
    const userId = Number(req.query.userId || 1);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userExp = user.total_earned; // Use total_earned as EXP
    
    // Fallback if vipConfig doesn't exist, use simple thresholds
    // Assuming VIP 1: 0, VIP 2: 500k, VIP 3: 2M, VIP 4: 5M, VIP 5: 10M
    let currentVip = 1;
    let nextExp = 500000;
    let bonusRate = 0;
    if (userExp >= 10000000) { currentVip = 5; nextExp = null; bonusRate = 8; }
    else if (userExp >= 5000000) { currentVip = 4; nextExp = 10000000; bonusRate = 6; }
    else if (userExp >= 2000000) { currentVip = 3; nextExp = 5000000; bonusRate = 4; }
    else if (userExp >= 500000) { currentVip = 2; nextExp = 2000000; bonusRate = 2; }
    
    res.json({
      success: true,
      data: {
        userId: user.id,
        userName: user.name,
        availableBalance: user.available_balance,
        pendingBalance: user.pending_balance,
        totalEarned: user.total_earned,
        currentVip,
        nextExp,
        bonusRate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Thống kê giới thiệu
router.get("/user/referral-stats", async (req, res) => {
  try {
    const userId = Number(req.query.userId || 1);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const count = await prisma.user.count({ where: { referred_by: userId } });

    res.json({
      success: true,
      data: {
        referralCode: user.referral_code,
        totalReferred: count,
        totalReferralEarnings: 0 // Mock for now
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Lấy danh sách lịch sử đối soát đơn THẬT của User từ SQLite
router.get("/user/conversions", async (req, res) => {
  try {
    const db = await getDb();
    const userId = Number(req.query.userId || 1);
    const conversions = await db.all(
      "SELECT * FROM conversions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json({
      success: true,
      data: conversions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lịch sử biến động số dư của User, ghép từ conversion và withdrawal thật
router.get("/user/balance-history", async (req, res) => {
  try {
    const userId = Number(req.query.userId || 1);
    const db = await getDb();
    const [conversions, withdrawals] = await Promise.all([
      db.all(
        "SELECT id, title, cashback, status, created_at FROM conversions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100",
        [userId]
      ),
      prisma.withdrawal.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: 100,
        select: { id: true, amount: true, status: true, created_at: true }
      })
    ]);

    const items = [
      ...conversions.map((item) => ({
        id: `conversion-${item.id}`,
        type: "CASHBACK",
        title: item.title || "Hoàn tiền từ đơn hàng",
        amount: Number(item.cashback || 0),
        status: item.status || "PENDING",
        createdAt: item.created_at
      })),
      ...withdrawals.map((item) => ({
        id: `withdrawal-${item.id}`,
        type: "WITHDRAWAL",
        title: "Rút tiền về ngân hàng",
        amount: -Number(item.amount || 0),
        status: item.status || "PENDING",
        createdAt: item.created_at
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ================= ADMIN ROUTES ================= //

// Admin: Get Dashboard Stats
router.get("/admin/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalEarnings = await prisma.user.aggregate({
      _sum: { total_earned: true, pending_balance: true }
    });
    const totalEarned = totalEarnings._sum.total_earned || 0;
    const pendingEarned = totalEarnings._sum.pending_balance || 0;
    
    // Quick mock for conversions
    const db = await getDb();
    const conversionStats = await db.get("SELECT COUNT(*) as count FROM conversions");

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEarned,
        pendingWithdrawals: pendingEarned,
        totalOrders: conversionStats.count || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Get All Users
router.get("/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        available_balance: true,
        pending_balance: true,
        total_earned: true,
        referral_code: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ================= ADMIN RECONCILIATION ROUTES ================= //
router.get("/admin/conversions", getConversions);
router.post("/admin/conversions/approve", approveConversion);
router.post("/admin/conversions/reject", rejectConversion);


router.get("/admin/withdrawals", getWithdrawals);
router.post("/admin/withdrawals/approve", approveWithdrawal);
router.post("/admin/withdrawals/reject", rejectWithdrawal);


// System Settings
router.get("/admin/settings", getSettings);
router.post("/admin/settings", updateSettings);

// Admin API: Cập nhật thông số thưởng VIP trong DB
router.post("/admin/update-vip-level", async (req, res) => {
  try {
    const db = await getDb();
    const { level, title, minExp, bonusRate, rewardCash } = req.body;

    await db.run(
      "UPDATE vip_levels SET title = ?, min_exp = ?, bonus_rate = ?, reward_cash = ? WHERE level = ?",
      [title, minExp, bonusRate, rewardCash, level]
    );

    res.json({
      success: true,
      message: `Đã cập nhật mức thưởng VIP ${level} thành công trong SQLite DB!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint Admin bấm kích hoạt thủ công đối soát đơn ngay lập tức
router.post("/admin/trigger-sync-reports", async (req, res) => {
  try {
    await syncShopeeConversionReports();
    res.json({
      success: true,
      message: "Đã kích hoạt quét & đối soát đơn hàng thật từ Shopee API thành công!"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Modular Routes
router.use("/affiliate", affiliateRoutes);

export default router;
