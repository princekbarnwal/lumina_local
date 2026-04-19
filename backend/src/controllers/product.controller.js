import prisma from "../config/prisma.js";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const upload = multer({ dest: "uploads/" });


export const createProduct = async (req, res) => {
  try {
    const { name, shopId } = req.body;

    const shop = await prisma.shop.findUnique({
        where: { id: shopId },
    });

    if (!shop || shop.ownerId !== req.user.userId) {
        return res.status(403).json({ error: "Not authorized" });
    }
    const product = await prisma.product.create({
      data: {
        name,
        shopId,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.query;

    const products = await prisma.product.findMany({
      where: { shopId: Number(shopId) },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const bulkUpload = [
  upload.single("file"),
  async (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const products = results.map((item) => ({
            name: item.name,
            shopId: Number(req.body.shopId),
          }));

          await prisma.product.createMany({
            data: products,
          });

          res.json({ message: "Bulk upload successful" });
        } catch (err) {
          res.status(500).json({ error: "Upload failed" });
        }
      });
  },
];