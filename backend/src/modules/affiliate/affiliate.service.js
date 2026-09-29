import prisma from "../../lib/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import { convertShopeeLinkViaApi } from "../shopee/shopee.service.js";
import { scrapeShopeeProductDetail } from "../shopee/shopeeScraper.service.js";

const SHOPEE_AFFILIATE_ID = "17325340629";

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
 * Tự động nhận diện nền tảng từ URL
 */
export function detectPlatform(originUrl) {
  let url;
  try {
    url = new URL(originUrl.startsWith("http") ? originUrl : `https://${originUrl}`);
  } catch {
    throw new ApiError(400, "Đường dẫn không hợp lệ. Vui lòng nhập đúng định dạng URL.");
  }

  const hostname = url.hostname.toLowerCase();

  // Shopee
  if (
    hostname === "shopee.vn" ||
    hostname.endsWith(".shopee.vn") ||
    hostname === "shp.ee" ||
    hostname.endsWith(".shp.ee") ||
    hostname === "shope.ee" ||
    hostname.endsWith(".shope.ee")
  ) {
    return {
      key: "SHOPEE",
      name: "Shopee",
      color: "#EE4D2D",
      icon: "shopping_bag"
    };
  }

  // TikTok Shop
  if (
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com") ||
    hostname === "vt.tiktok.com" ||
    hostname === "shop.tiktok.com"
  ) {
    return {
      key: "TIKTOK",
      name: "TikTok Shop",
      color: "#000000",
      icon: "movie"
    };
  }

  // Lazada
  if (
    hostname === "lazada.vn" ||
    hostname.endsWith(".lazada.vn") ||
    hostname === "sl.lazada.vn" ||
    hostname === "s.lazada.vn"
  ) {
    return {
      key: "LAZADA",
      name: "Lazada",
      color: "#0F146D",
      icon: "local_mall"
    };
  }

  return {
    key: "OTHER",
    name: "Nền tảng khác",
    color: "#64748B",
    icon: "link"
  };
}

/**
 * Trích xuất tên sản phẩm từ URL nếu fallback
 */
function extractProductNameFromUrl(url) {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const pathname = decodeURIComponent(parsed.pathname);

    const matchSlug = pathname.match(/\/([^\/]+)-i\.\d+\.\d+/);
    if (matchSlug && matchSlug[1]) {
      return matchSlug[1].replace(/[-_]+/g, " ").trim();
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const lastSeg = segments[segments.length - 1];
      const cleaned = lastSeg.replace(/-i\.\d+\.\d+/, "").replace(/[-_]+/g, " ").trim();
      if (
        cleaned.length > 3 &&
        !cleaned.includes(".html") &&
        !cleaned.toLowerCase().includes("product") &&
        !cleaned.toLowerCase().includes("universal-link")
      ) {
        return cleaned;
      }
    }
  } catch {
    // Fallback
  }
  return "Sản Phẩm Tiếp Thị Shopee";
}

function getContextualProductImage(name, fallbackShopImage) {
  const lower = (name || "").toLowerCase();
  
  if (lower.includes("áo") || lower.includes("polo") || lower.includes("quần") || lower.includes("váy") || lower.includes("thời trang") || lower.includes("nam") || lower.includes("nữ") || lower.includes("vải")) {
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("quạt") || lower.includes("fan") || lower.includes("điều hòa") || lower.includes("làm mát")) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("chuột") || lower.includes("bàn phím") || lower.includes("tai nghe") || lower.includes("loa") || lower.includes("laptop") || lower.includes("máy tính") || lower.includes("pin") || lower.includes("sạc")) {
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("giày") || lower.includes("dép") || lower.includes("sneaker")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("mỹ phẩm") || lower.includes("son") || lower.includes("kem") || lower.includes("dưỡng") || lower.includes("serum")) {
    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("đồ chơi") || lower.includes("mẹ bé") || lower.includes("sữa") || lower.includes("trẻ")) {
    return "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80";
  }
  if (lower.includes("nhà cửa") || lower.includes("gia dụng") || lower.includes("bếp") || lower.includes("nồi") || lower.includes("chảo")) {
    return "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80";
  }
  return fallbackShopImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
}

/**
 * Kiểm tra & chuyển đổi Link sản phẩm thành công với % Hoa hồng THỰC TẾ
 */
export async function convertLink(payload) {
  const { originUrl, subId1, subId2 } = payload || {};

  if (!originUrl || typeof originUrl !== "string") {
    throw new ApiError(400, "Vui lòng cung cấp đường dẫn gốc originUrl");
  }

  const cleanUrl = originUrl.trim();
  const lowerUrl = cleanUrl.toLowerCase();

  // Kiểm tra trường hợp test không có hoa hồng
  if (lowerUrl.includes("no-commission") || lowerUrl.includes("khong-co-hoa-hong")) {
    return {
      hasCommission: false,
      message: "Sản phẩm này hiện không có hoa hồng hoàn tiền"
    };
  }

  const platformInfo = detectPlatform(cleanUrl);
  
  if (platformInfo.key === "OTHER") {
    return {
      hasCommission: false,
      message: "Sản phẩm này hiện tại không có chiết khấu"
    };
  }

  let affiliateUrl = "";
  let shopeeApiResult = null;

  // Gắn mã User định danh vào SubID1 để Shopee Report API ghi nhận người mua thật
  const targetSubId1 = subId1 || "user_1";

  // 1. Gọi shopee-aff-api lấy Link Rút Gọn & Thông tin % Hoa Hồng Thật
  if (platformInfo.key === "SHOPEE") {
    try {
      shopeeApiResult = await convertShopeeLinkViaApi({
        originalLink: cleanUrl,
        subId1: targetSubId1,
        subId2: subId2 || ""
      });
      if (shopeeApiResult?.shortLink) {
        affiliateUrl = shopeeApiResult.shortLink;
      }
    } catch {
      // Fallback
    }

    if (!affiliateUrl) {
      const encoded = encodeURIComponent(cleanUrl);
      let subParams = `&affiliate_id=${SHOPEE_AFFILIATE_ID}&sub_id=${encodeURIComponent(targetSubId1)}`;
      if (subId2) subParams += `&sub_id2=${encodeURIComponent(subId2)}`;

      affiliateUrl = `https://shope.ee/an_redir?origin_link=${encoded}${subParams}`;
    }
  } else if (platformInfo.key === "TIKTOK") {
    const encoded = encodeURIComponent(cleanUrl);
    affiliateUrl = `https://vt.tiktok.com/aff?url=${encoded}&sub1=${encodeURIComponent(targetSubId1)}`;
  } else if (platformInfo.key === "LAZADA") {
    const encoded = encodeURIComponent(cleanUrl);
    affiliateUrl = `https://s.lazada.vn/s.aff?url=${encoded}&sub1=${encodeURIComponent(targetSubId1)}`;
  } else {
    const encoded = encodeURIComponent(cleanUrl);
    affiliateUrl = `https://apphoantien.vn/redirect?url=${encoded}&sub1=${encodeURIComponent(targetSubId1)}`;
  }

  // 2. Bóc tách dữ liệu THỰC TẾ (Tên, Ảnh, Giá, Shop) từ Shopee
  let realDetail = null;
  if (platformInfo.key === "SHOPEE") {
    // Chỉ lấy Tên, Giá, Ảnh từ bên thứ 3 (Do Shopee giấu giá)
    try {
      const addLiveTagRes = await fetchWithTimeout(`https://data.addlivetag.com/product-data/product-data.php?url=${encodeURIComponent(cleanUrl)}`);
      if (addLiveTagRes.ok) {
        const addLiveTagJson = await addLiveTagRes.json();
        if (addLiveTagJson.status === "success" && addLiveTagJson.productInfo) {
          const info = addLiveTagJson.productInfo;
          realDetail = {
            productName: info.productName,
            productImage: info.imageUrl,
            rawPrice: info.price,
            shopName: info.shopName
          };
        }
      }
    } catch (e) {
      console.log("[DEBUG] addlivetag API fail:", e.message);
    }
    
    // Fallback nếu API 3rd party tịt
    if (!realDetail) {
      realDetail = await scrapeShopeeProductDetail(cleanUrl);
    }
  }

  // 3. Đọc dữ liệu chi tiết từ Shopee API (nếu shopee-aff-api trả về batch_item_for_item_card_full, offerInfo hoặc shopOffer)
  const rawShopeeData = shopeeApiResult?.rawResponse || shopeeApiResult;
  const cardData = rawShopeeData?.data?.batch_item_for_item_card_full || shopeeApiResult?.offerInfo?.batch_item_for_item_card_full;
  const commRateData = rawShopeeData?.data?.commission_rate || shopeeApiResult?.offerInfo?.commission_rate;

  let rawName = realDetail?.productName || cardData?.name || shopeeApiResult?.productName || shopeeApiResult?.offerInfo?.productName;
  if (!rawName || rawName.includes("Shopping Cart") || rawName.includes("Shopee Việt Nam") || /^\d+$/.test(rawName.trim())) {
    
    if (
      realDetail?.productName &&
      !realDetail.productName.includes("Shopping Cart") &&
      !realDetail.productName.includes("Shopee Việt Nam") &&
      !/^\d+$/.test(realDetail.productName.trim())
    ) {
      rawName = realDetail.productName; // 1. Ưu tiên tên bóc từ WhatsApp User-Agent
    } else {
      const slugName = extractProductNameFromUrl(cleanUrl);
      if (slugName && slugName !== "Sản Phẩm Tiếp Thị Shopee" && !/^\d+$/.test(slugName.trim())) {
        rawName = slugName; // 2. Fallback lấy tên từ URL slug
      } else if (shopeeApiResult?.shopName) {
        rawName = `Sản Phẩm Tiếp Thị — ${shopeeApiResult.shopName}`;
      } else {
        rawName = "Sản Phẩm Tiếp Thị Shopee";
      }
    }
  }
  const productName = rawName;
  
  const shopImage = shopeeApiResult?.shopImage || null;
  let productImage = null;
  if (cardData?.image) {
    productImage = cardData.image.startsWith("http") ? cardData.image : `https://down-vn.img.susercontent.com/file/${cardData.image}`;
  } else if (shopeeApiResult?.productImage) {
    productImage = shopeeApiResult.productImage;
  } else if (shopeeApiResult?.offerInfo?.imageUrl) {
    productImage = shopeeApiResult.offerInfo.imageUrl;
  } else if (realDetail?.productImage) {
    productImage = realDetail.productImage;
  } else {
    productImage = getContextualProductImage(productName, shopImage);
  }

  const shopName = cardData?.shop_name 
    ? `${cardData.shop_name} (Shop Đảm Bảo)` 
    : (shopeeApiResult?.shopName ? `${shopeeApiResult.shopName} (Shop Đảm Bảo)` : (shopeeApiResult?.offerInfo?.shopName ? `${shopeeApiResult.offerInfo.shopName} (Shop Đảm Bảo)` : (realDetail?.shopName ? `${realDetail.shopName} (Shop Đảm Bảo)` : `${platformInfo.name} Official`)));

  // Đọc Giá thực tế từ Card data Shopee API (Shopee trả về đơn vị * 100.000)
  let rawPrice = 0;
  if (cardData?.price) {
    rawPrice = Number(cardData.price) / 100000;
  } else if (cardData?.price_min) {
    rawPrice = Number(cardData.price_min) / 100000;
  } else if (shopeeApiResult?.offerInfo?.priceMin) {
    rawPrice = Number(shopeeApiResult.offerInfo.priceMin) / 100000;
  } else if (realDetail?.rawPrice) {
    rawPrice = realDetail.rawPrice;
  }

  let formattedPrice = rawPrice > 0 
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(rawPrice)
    : "Giá hiển thị khi vào App Shopee";

  // Đọc Hoa hồng thực tế từ Shopee API Response (Lấy chuẩn từ Worker cục bộ offer/shop của mình!)
  const apiCommissionStr = rawShopeeData?.data?.commission || commRateData?.web_exist_commission || commRateData?.default_commission || shopeeApiResult?.commission;
  const apiRateStr = shopeeApiResult?.commissionRate || commRateData?.max_commission_rate || commRateData?.default_commission_rate;

  let estimatedCommissionStr = "";
  let realCommissionRateText = apiRateStr || "Theo chính sách Shopee";

  if (apiRateStr) {
    // 100% Tự tính toán (Cơ chế Cắt ngọn Cap nội bộ do mình kiểm soát hoàn toàn)
    if (rawPrice > 0) {
      const totalRateNum = parseFloat(String(apiRateStr).replace("%", "").replace(",", "."));
      const baseRateEnv = parseFloat(process.env.SHOPEE_BASE_RATE || "2.5");
      const capEnv = parseInt(process.env.SHOPEE_CAP || "40000", 10);
      
      // Tách Hoa hồng Sàn (bị trần) và Hoa hồng Xtra (không trần)
      const shopeeRateNum = Math.min(totalRateNum, baseRateEnv); // Sàn tối đa bằng base_rate
      const xtraRateNum = totalRateNum > baseRateEnv ? totalRateNum - baseRateEnv : 0;
      
      // Tính tiền
      const rawShopeeComm = (rawPrice * shopeeRateNum) / 100;
      const shopeeCommFinal = Math.min(rawShopeeComm, capEnv); // Áp dụng mức trần 40k
      const xtraCommFinal = (rawPrice * xtraRateNum) / 100; // Xtra không bị trần
      
      
      // Lấy tỷ lệ chia sẻ cho khách từ DB
      const baseRateMeta = await prisma.syncMeta.findUnique({ where: { key: 'cashback_base_rate' }});
      const baseRateShare = baseRateMeta && !isNaN(Number(baseRateMeta.value)) ? Number(baseRateMeta.value) / 100 : 0.5;
      
      const totalShopeeComm = shopeeCommFinal + xtraCommFinal;
      // Trả cho khách = Tổng hoa hồng * (tỷ lệ admin cài đặt)
      const exactComm = Math.round(totalShopeeComm * baseRateShare);

      const formattedComm = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(exactComm);
      estimatedCommissionStr = `${formattedComm} (${apiRateStr})`;
    } else {
      estimatedCommissionStr = `${apiRateStr} giá trị đơn hàng (Hoa hồng từ Shop)`;
    }
  } else if (apiCommissionStr) {
    estimatedCommissionStr = `${apiCommissionStr} (Hoa hồng thực tế từ Shopee)`;
  } else {
    estimatedCommissionStr = "Tính tự động trên đơn hàng thành công";
  }

  return {
    hasCommission: true,
    platform: platformInfo.key,
    platformName: platformInfo.name,
    platformColor: platformInfo.color,
    platformIcon: platformInfo.icon,
    productName,
    productImage,
    shopImage,
    price: formattedPrice,
    rawPrice,
    commissionRate: realCommissionRateText,
    estimatedCommission: estimatedCommissionStr,
    shopName,
    shopRating: shopeeApiResult?.shopRating || null,
    shopFollowers: shopeeApiResult?.shopFollowers || null,
    originUrl: cleanUrl,
    affiliateUrl
  };
}
