/**
 * Service bóc tách dữ liệu sản phẩm thực tế từ Shopee (Tên, Ảnh, Giá, Tên Shop, Đánh giá)
 */
export async function scrapeShopeeProductDetail(originUrl) {
  try {
    let fetchUrl = originUrl;

    const matchProduct = originUrl.match(/product\/(\d+)\/(\d+)/);
    if (matchProduct) {
      fetchUrl = `https://shopee.vn/product/${matchProduct[1]}/${matchProduct[2]}`;
    } else {
      const matchShort = originUrl.match(/i\.(\d+)\.(\d+)/);
      if (matchShort) {
        fetchUrl = `https://shopee.vn/product/${matchShort[1]}/${matchShort[2]}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let response;
    try {
      response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "User-Agent": "WhatsApp/2.21.12.21 A",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);

    let productName = ogTitleMatch ? ogTitleMatch[1].replace(/\|\s*Shopee Việt Nam$/i, '').trim() : null;
    let productImage = ogImageMatch ? ogImageMatch[1] : null;

    if (productName || productImage) {
      return {
        productName,
        productImage,
        rawPrice: null, // Scraped via WhatsApp doesn't have reliable price
        price: null,
        shopName: null
      };
    }
  } catch (err) {
    console.error("[ShopeeScraper] Error scraping detail:", err.message);
  }

  return null;
}
