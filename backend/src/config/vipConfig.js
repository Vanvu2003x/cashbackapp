import { getDb } from "./db.js";

/**
 * Lấy thông tin VIP động của User dựa trên số EXP & Cấu hình Cấp độ trong DB SQLite
 */
export async function getVipStatusFromDb(userExp = 0) {
  const db = await getDb();
  const dbLevels = await db.all("SELECT * FROM vip_levels ORDER BY level ASC");

  const vipList = dbLevels.map((item) => ({
    level: item.level,
    name: item.title,
    minExp: item.min_exp,
    bonusRatePercent: item.bonus_rate,
    rewardCash: item.reward_cash
  }));

  let currentVip = vipList[0];
  let nextVip = vipList[1];

  for (let i = vipList.length - 1; i >= 0; i--) {
    if (userExp >= vipList[i].minExp) {
      currentVip = vipList[i];
      nextVip = vipList[i + 1] || null;
      break;
    }
  }

  const expToNext = nextVip ? nextVip.minExp - userExp : 0;
  const progressPercent = nextVip
    ? Math.min(100, Math.round(((userExp - currentVip.minExp) / (nextVip.minExp - currentVip.minExp)) * 100))
    : 100;

  return {
    currentLevel: currentVip.level,
    title: currentVip.name,
    bonusRate: currentVip.bonusRatePercent,
    currentExp: userExp,
    nextLevel: nextVip?.level || null,
    nextLevelTitle: nextVip?.name || null,
    nextMinExp: nextVip?.minExp || currentVip.minExp,
    expToNext,
    rewardNextCash: nextVip?.rewardCash || 0,
    progressPercent,
    allVipLevels: vipList
  };
}
