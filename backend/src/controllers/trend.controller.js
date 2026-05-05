import prisma from "../config/prisma.js";
import { analyzeTrends } from "../services/trend.service.js";

export const getProductTrends = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const trends = await analyzeTrends({
      scope: "product",
      scopeId: productId,
    });

    res.json({
      productId,
      productName: product.name,
      ratingChange: trends.ratingChange,
      negativeTrend: trends.negativeTrend,
      positiveTrend: trends.positiveTrend,
      reviewVolumeChange: trends.reviewVolumeChange,
      reviewSpike: trends.reviewSpike,
      alerts: trends.alerts,
      window: trends.window,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product trends" });
  }
};

export const getShopTrends = async (req, res) => {
  try {
    const shopId = Number(req.params.shopId);

    if (!Number.isInteger(shopId) || shopId <= 0) {
      return res.status(400).json({ error: "Invalid shop id" });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const trends = await analyzeTrends({
      scope: "shop",
      scopeId: shopId,
    });

    res.json({
      shopId,
      shopName: shop.name,
      ratingChange: trends.ratingChange,
      negativeTrend: trends.negativeTrend,
      positiveTrend: trends.positiveTrend,
      reviewVolumeChange: trends.reviewVolumeChange,
      reviewSpike: trends.reviewSpike,
      alerts: trends.alerts,
      window: trends.window,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop trends" });
  }
};
