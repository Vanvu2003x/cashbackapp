import { env } from "../../config/env.js";

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Gọi sang dịch vụ shopee-aff-api (Cloudflare Worker) để quy đổi link Shopee Affiliate & % Hoa hồng thật
 */
export async function convertShopeeLinkViaApi({ originalLink, subId1, subId2 }) {
  const ports = [8787, 8788];
  let lastError = null;

  for (const port of ports) {
    try {
      const endpoint = `http://127.0.0.1:${port}/api/affiliate/convert-link`;
      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          originalLink: Array.isArray(originalLink) ? originalLink : [originalLink],
          subId1: subId1 || "",
          subId2: subId2 || ""
        })
      });

      if (response.ok) {
        const json = await response.json();
        const batchItem = json?.data?.batchCustomLink?.[0] || json;

        const shortLink = batchItem?.shortLink || json?.shortLink || json?.data?.long_link || batchItem?.longLink || json?.longLink;
        const longLink = batchItem?.longLink || json?.longLink || json?.data?.long_link || shortLink;

        const commissionRate =
          batchItem?.commissionRate ??
          batchItem?.shopOffer?.commission_rate ??
          json?.commissionRate ??
          json?.offerInfo?.commissionRate ??
          json?.data?.commission_rate?.max_commission_rate;
        const commission = batchItem?.commission ?? json?.commission ?? json?.offerInfo?.commission ?? json?.data?.commission;

        return {
          shortLink,
          longLink,
          failCode: batchItem?.failCode ?? json?.failCode ?? 0,
          commissionRate,
          commission,
          shopName: batchItem?.shopName || batchItem?.shopOffer?.shop_name,
          shopImage: batchItem?.shopImage || batchItem?.shopOffer?.shop_image || batchItem?.shopOffer?.portrait,
          shopRating: batchItem?.shopRating || batchItem?.shopOffer?.rating,
          shopOffer: batchItem?.shopOffer,
          productName: batchItem?.productName || batchItem?.offerInfo?.productName,
          productImage: batchItem?.productImage || batchItem?.offerInfo?.imageUrl,
          offerInfo: batchItem?.offerInfo || json?.offerInfo || json?.data || { commissionRate, commission },
          rawResponse: json
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Không thể tạo link rút gọn từ Shopee AFF API");
}
