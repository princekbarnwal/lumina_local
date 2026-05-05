import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import shopRoutes from "./routes/shop.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import publicShopRoutes from "./routes/publicShop.route.js";
import analyticsRoutes from "./routes/analytics.route.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/shops", shopRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/shop", publicShopRoutes);
app.use("/", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});
app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
