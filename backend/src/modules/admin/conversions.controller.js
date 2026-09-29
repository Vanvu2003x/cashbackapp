
import prisma from "../../lib/prisma.js";

// Lấy danh sách đối soát
export const getConversions = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    let where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { title: { contains: search } }
      ];
    }

    const rawConversions = await prisma.conversion.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { created_at: 'desc' }
    });

    // Manual join to avoid Prisma schema migration issues
    const userIds = [...new Set(rawConversions.map(c => c.user_id))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    });
    
    const conversions = rawConversions.map(c => ({
      ...c,
      User: users.find(u => u.id === c.user_id) || { name: 'Unknown' }
    }));

    const total = await prisma.conversion.count({ where });

    res.json({ success: true, data: conversions, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Duyệt đơn hàng (Cộng tiền)
export const approveConversion = async (req, res) => {
  try {
    const { id } = req.body;
    
    // 1. Transaction đảm bảo ACID
    const result = await prisma.$transaction(async (tx) => {
      // Lock và lấy conversion
      const conversion = await tx.conversion.findUnique({ where: { id } });
      if (!conversion) throw new Error("Không tìm thấy đơn hàng");
      if (conversion.status !== "PENDING") throw new Error("Chỉ có thể duyệt đơn ở trạng thái PENDING");
      
      // Lấy User
      const user = await tx.user.findUnique({ where: { id: conversion.user_id } });
      if (!user) throw new Error("Không tìm thấy User của đơn hàng này");

      const cashbackAmount = conversion.cashback || 0;
      const expGained = Math.floor(cashbackAmount / 1000);

      // Cập nhật trạng thái đơn
      const updatedConversion = await tx.conversion.update({
        where: { id },
        data: { status: "APPROVED" }
      });

      // Cập nhật số dư người dùng (Trừ Pending, Cộng Available)
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          pending_balance: { decrement: cashbackAmount },
          available_balance: { increment: cashbackAmount },
          total_earned: { increment: cashbackAmount },
          current_exp: { increment: expGained }
        }
      });

      return { updatedConversion, updatedUser };
    });

    res.json({ success: true, message: "Đã duyệt đơn hàng thành công!", data: result.updatedConversion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Từ chối đơn hàng (Hủy)
export const rejectConversion = async (req, res) => {
  try {
    const { id } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      const conversion = await tx.conversion.findUnique({ where: { id } });
      if (!conversion) throw new Error("Không tìm thấy đơn hàng");
      if (conversion.status !== "PENDING") throw new Error("Chỉ có thể hủy đơn ở trạng thái PENDING");
      
      const cashbackAmount = conversion.cashback || 0;

      // Cập nhật trạng thái đơn
      const updatedConversion = await tx.conversion.update({
        where: { id },
        data: { status: "REJECTED" }
      });

      // Trừ Pending balance, không cộng vào Available
      await tx.user.update({
        where: { id: conversion.user_id },
        data: {
          pending_balance: { decrement: cashbackAmount }
        }
      });

      return updatedConversion;
    });

    res.json({ success: true, message: "Đã từ chối đơn hàng thành công!", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
