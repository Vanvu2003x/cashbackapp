
import prisma from "../../lib/prisma.js";

// Lấy cài đặt hệ thống
export const getSettings = async (req, res) => {
  try {
    const keys = ["cashback_base_rate", "min_withdrawal_amount"];
    const settings = await prisma.syncMeta.findMany({
      where: { key: { in: keys } }
    });

    // Mặc định
    const defaultSettings = {
      cashback_base_rate: "50",
      min_withdrawal_amount: "50000"
    };

    const result = { ...defaultSettings };
    settings.forEach(s => {
      if (s.key && s.value) result[s.key] = s.value;
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Cập nhật cài đặt
export const updateSettings = async (req, res) => {
  try {
    const { cashback_base_rate, min_withdrawal_amount } = req.body;
    
    if (cashback_base_rate !== undefined) {
      await prisma.syncMeta.upsert({
        where: { key: "cashback_base_rate" },
        update: { value: String(cashback_base_rate) },
        create: { key: "cashback_base_rate", value: String(cashback_base_rate) }
      });
    }

    if (min_withdrawal_amount !== undefined) {
      await prisma.syncMeta.upsert({
        where: { key: "min_withdrawal_amount" },
        update: { value: String(min_withdrawal_amount) },
        create: { key: "min_withdrawal_amount", value: String(min_withdrawal_amount) }
      });
    }

    res.json({ success: true, message: "Cập nhật cài đặt thành công" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
