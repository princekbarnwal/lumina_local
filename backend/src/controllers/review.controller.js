import prisma from "../config/prisma.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userIdentifier = req.body.userIdentifier || req.body.user_identifier;
    const parsedProductId = Number(productId);
    const parsedRating = Number(rating);

    if (!parsedProductId) {
      return res.status(400).json({ error: "Product id is required" });
    }

    if (!userIdentifier) {
      return res.status(400).json({ error: "User identifier is required" });
    }

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: parsedProductId,
        userIdentifier,
      },
    });

    if (existingReview) {
      return res.status(409).json({ error: "Review already submitted for this product" });
    }

    const review = await prisma.review.create({
      data: {
        productId: parsedProductId,
        userIdentifier,
        rating: parsedRating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Review already submitted for this product" });
    }

    res.status(500).json({ error: "Failed to create review" });
  }
};
