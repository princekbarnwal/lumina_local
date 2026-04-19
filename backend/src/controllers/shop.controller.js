import prisma from "../config/prisma.js";

export const createShop = async (req, res) => {
  try {
    const { name } = req.body;

    const shop = await prisma.shop.create({
      data: {
        name,
        ownerId: req.user.userId,
      },
    });

    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create shop" });
  }
};

export const getMyShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        ownerId: req.user.userId,
      },
    });

    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
};

export const getPublicShopProducts = async (req, res) => {
  try {
    const shopId = Number(req.params.shopId);

    if (!shopId) {
      return res.status(400).json({ error: "Invalid shop id" });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const products = await prisma.product.findMany({
      where: { shopId },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop products" });
  }
};
