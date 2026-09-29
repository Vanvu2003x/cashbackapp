
import fs from "fs";
import { getDb } from "../../config/db.js";
import { getVipStatusFromDb } from "../../config/vipConfig.js";

export async function syncShopeeConversionReports() {
  console.log("=== 🕒 [CRONJOB] ĐỒNG BỘ ĐỐI SOÁT TỪ SHOPEE API TỰ ĐỘNG ===");
  try {
    const db = await getDb();
    const ports = [8787, 8788];
    const lastSyncMeta = await db.get("SELECT value FROM sync_meta WHERE key = 'last_shopee_sync_time'");
    const now = new Date();
    const defaultStart = new Date(now.getTime() - 14 * 24 * 3600 * 1000);
    const startDateObj = lastSyncMeta ? new Date(Number(lastSyncMeta.value)) : defaultStart;
    const startDate = startDateObj.toISOString().split("T")[0];
    const endDate = now.toISOString().split("T")[0];
    console.log(`🔎 Phạm vi đối soát cuốn chiếu: Từ [${startDate}] đến [${endDate}]`);

    let page = 1;
    const limit = 50; 
    let hasMore = true;
    let totalProcessed = 0;

    while (hasMore) {
      let rawText = "";
      for (const port of ports) {
        try {
          const response = await fetch(`http://127.0.0.1:${port}/api/affiliate/conversion-reports`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startDate, endDate, limit, page })
          });
          if (response.ok) { rawText = await response.text(); break; }
        } catch { /* Ignore */ }
      }

      if (!rawText) {
        console.log(`⚠️ Không thể kết nối shopee-aff-api ở trang ${page}. Dừng quét.`);
        break;
      }

      const reportJson = JSON.parse(rawText);
      const orderList = reportJson?.data?.list || [];
      if (orderList.length === 0) { hasMore = false; break; }

      console.log(`📦 Đang xử lý Trang ${page} (${orderList.length} đơn hàng)...`);

      for (const order of orderList) {
        const orderSn = order.order_sn || order.ordersn;
        const subId1 = order.sub_id1 || order.subid1 || "";
        const orderStatus = Number(order.order_status || order.status);
        const totalCommission = Number(order.total_commission || order.commission || 0);

        const matchUser = subId1.match(/user_(\d+)/);
        const userId = matchUser ? Number(matchUser[1]) : 1;
        const existingOrder = await db.get("SELECT status FROM conversions WHERE id = ?", [orderSn]);
        
        // Shopee Status: 1 = Pending, 2 = Completed, 3 = Cancelled
        if (orderStatus === 1 || orderStatus === 2 || orderStatus === 3 || orderStatus === 4) {
          const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
          if (!user) continue;

          const userExp = user.current_exp;
          const vipStatus = await getVipStatusFromDb(userExp);
          
          const baseRateMeta = await db.get("SELECT value FROM sync_meta WHERE key = 'cashback_base_rate'");
          const baseRateNum = baseRateMeta && !isNaN(Number(baseRateMeta.value)) ? Number(baseRateMeta.value) : 50;
          const baseCashbackRatio = (baseRateNum / 100) + (vipStatus.bonusRate / 100);

          const userCashback = Math.round(totalCommission * baseCashbackRatio);
          const expGained = Math.floor(userCashback / 1000);

          let targetStatus = "PENDING";
          if (orderStatus === 2 || orderStatus === 4) targetStatus = "APPROVED"; // 4 might be validated/completed too
          if (orderStatus === 3) targetStatus = "REJECTED";

          const currentDbStatus = existingOrder ? existingOrder.status : null;

          if (currentDbStatus === targetStatus) continue;

          // Transaction-like update via queries (we use raw sqlite here, wait we are using db.run)
          if (!existingOrder) {
            await db.run(
              "INSERT INTO conversions (id, user_id, platform, title, price, cashback, rate, status) VALUES (?, ?, 'Shopee', ?, ?, ?, ?, ?)",
              [orderSn, userId, order.item_name || "Đơn hàng Shopee", order.total_pay || 0, userCashback, `${vipStatus.bonusRate + baseRateNum}%`, targetStatus]
            );
            if (targetStatus === "PENDING") {
              await db.run("UPDATE users SET pending_balance = pending_balance + ? WHERE id = ?", [userCashback, userId]);
            } else if (targetStatus === "APPROVED") {
              await db.run("UPDATE users SET available_balance = available_balance + ?, total_earned = total_earned + ?, current_exp = current_exp + ? WHERE id = ?", [userCashback, userCashback, expGained, userId]);
            }
          } else {
            await db.run("UPDATE conversions SET status = ? WHERE id = ?", [targetStatus, orderSn]);
            if (currentDbStatus === "PENDING" && targetStatus === "APPROVED") {
              await db.run("UPDATE users SET pending_balance = pending_balance - ?, available_balance = available_balance + ?, total_earned = total_earned + ?, current_exp = current_exp + ? WHERE id = ?", [userCashback, userCashback, userCashback, expGained, userId]);
            } else if (currentDbStatus === "PENDING" && targetStatus === "REJECTED") {
              await db.run("UPDATE users SET pending_balance = pending_balance - ? WHERE id = ?", [userCashback, userId]);
            }
          }
          totalProcessed++;
          console.log(`✅ Đơn #${orderSn} ➔ User #${userId}: Chuyển sang ${targetStatus} (Tiền: ${userCashback}đ)`);
        }
      }

      if (orderList.length < limit) hasMore = false;
      else page++;
    }

    await db.run("INSERT OR REPLACE INTO sync_meta (key, value) VALUES ('last_shopee_sync_time', ?)", [now.getTime().toString()]);
    console.log(`🎉 [ĐỐI SOÁT HOÀN TẤT] Tổng số đơn cập nhật trạng thái: ${totalProcessed}.`);
  } catch (err) {
    console.error("❌ Lỗi khi chạy Cronjob:", err.message);
  }
}
