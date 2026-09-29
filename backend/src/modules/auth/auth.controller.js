import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import { OAuth2Client } from "google-auth-library";

const SECRET = process.env.JWT_SECRET || "CASHBACK_SUPER_SECRET";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "VUI_LONG_DIEN_CLIENT_ID_CUA_BAN_VAO_ENV";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const register = async (req, res) => {
  try {
    const { email, password, name, referralCode } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email và Password là bắt buộc" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email đã tồn tại" });
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Handle referral code
    let referredById = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referral_code: referralCode } });
      if (referrer) {
        referredById = referrer.id;
      }
    }
    
    // Generate unique referral code
    let newRefCode = generateReferralCode();
    let isUnique = false;
    while (!isUnique) {
      const check = await prisma.user.findUnique({ where: { referral_code: newRefCode } });
      if (!check) isUnique = true;
      else newRefCode = generateReferralCode();
    }

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name: name || "User Mới",
        referral_code: newRefCode,
        referred_by: referredById
      }
    });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, balance: user.available_balance, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi Server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, balance: user.available_balance, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi Server" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) return res.status(400).json({ error: "Thiếu Google Token" });
    
    // Xác thực token với Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    // Tìm hoặc tạo User mới
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || "Google User", password: "" } // Mật khẩu rỗng vì dùng Google
      });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, balance: user.available_balance, role: user.role, picture } });
  } catch (error) {
    console.error("Lỗi Google Login:", error);
    res.status(401).json({ error: "Đăng nhập Google thất bại" });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Chưa đăng nhập" });
    const decoded = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: "User không tồn tại" });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, balance: user.available_balance, bankInfo: user.bankInfo, role: user.role } });
  } catch (error) {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};


export const requestWithdrawal = async (req, res) => {
  try {
    const { userId, amount, bankInfo } = req.body;
    
    // Check user
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ success: false, error: "Không tìm thấy user" });
    
    if (user.available_balance < amount) {
      return res.status(400).json({ success: false, error: "Số dư không đủ để rút" });
    }
    if (amount < 50000) {
      return res.status(400).json({ success: false, error: "Hạn mức rút tối thiểu là 50,000đ" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create withdrawal request
      const w = await tx.withdrawal.create({
        data: {
          user_id: user.id,
          amount: Number(amount),
          bank_info: bankInfo,
          status: "PENDING"
        }
      });

      // Deduct from available balance immediately
      await tx.user.update({
        where: { id: user.id },
        data: { available_balance: { decrement: Number(amount) } }
      });

      return w;
    });

    res.json({ success: true, message: "Đã gửi yêu cầu rút tiền thành công", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
