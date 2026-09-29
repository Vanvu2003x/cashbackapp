
import app from "./app.js";
import { env } from "./config/env.js";
import { syncShopeeConversionReports } from "./modules/affiliate/reportCron.service.js";

app.listen(env.port, () => {
  console.log(`[Backend API] Server running on http://localhost:${env.port}`);

  // Tự động đồng bộ mỗi 15 phút
  const SYNC_INTERVAL = 15 * 60 * 1000; 

  console.log(`🚀 [Auto-Sync] Đã kích hoạt tự động đồng bộ đơn hàng từ Shopee mỗi 15 phút.`);

  // Chạy lần đầu tiên sau khi server khởi động (chờ 10 giây để DB sẵn sàng)
  setTimeout(() => {
    syncShopeeConversionReports();
  }, 10000);

  // Lên lịch lặp lại
  setInterval(() => {
    syncShopeeConversionReports();
  }, SYNC_INTERVAL);
});
