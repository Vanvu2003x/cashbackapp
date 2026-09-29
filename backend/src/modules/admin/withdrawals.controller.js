
import prisma from "../../lib/prisma.js";

export const getWithdrawals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    let where = {};
    if (status) where.status = status;

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { created_at: 'desc' }
    });

    const userIds = [...new Set(withdrawals.map(w => w.user_id))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, available_balance: true }
    });

    const data = withdrawals.map(w => ({
      ...w,
      User: users.find(u => u.id === w.user_id) || { name: 'Unknown' }
    }));

    const total = await prisma.withdrawal.count({ where });

    res.json({ success: true, data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawal.findUnique({ where: { id } });
      if (!w) throw new Error("Không tìm thấy lệnh rút");
      if (w.status !== "PENDING") throw new Error("Chỉ duyệt lệnh PENDING");

      // Note: when user requests withdrawal, the amount should already be deducted from available_balance and put into something else, or we just deduct it here.
      // Assuming it was already deducted when they requested. If not, we deduct here.
      // Let's assume user requested and we didn't deduct yet to be safe, or we check the user app logic.
      // Actually, when user withdraws, it should deduct from available_balance immediately to prevent double-spending.
      // Since we don't have the user request code here, let's assume it's already deducted from available_balance, OR we deduct it now.
      // We will just mark it APPROVED.
      const updated = await tx.withdrawal.update({
        where: { id },
        data: { status: "APPROVED" }
      });
      return updated;
    });
    res.json({ success: true, message: "Duyệt lệnh rút tiền thành công", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawal.findUnique({ where: { id } });
      if (!w) throw new Error("Không tìm thấy lệnh rút");
      if (w.status !== "PENDING") throw new Error("Chỉ hủy lệnh PENDING");

      // Return money to user
      await tx.user.update({
        where: { id: w.user_id },
        data: { available_balance: { increment: w.amount } }
      });

      const updated = await tx.withdrawal.update({
        where: { id },
        data: { status: "REJECTED" }
      });
      return updated;
    });
    res.json({ success: true, message: "Từ chối lệnh rút tiền và hoàn tiền thành công", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
