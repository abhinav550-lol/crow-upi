const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");

/**
 * Create a new product (seller only).
 */
const createProduct = async (sellerId, data) => {
  return prisma.product.create({
    data: {
      sellerId,
      name: data.name,
      description: data.description || null,
      price: Number(data.price),
      imageUrl: data.imageUrl || null,
    },
  });
};

/**
 * List all active products.
 */
const getAllProducts = async () => {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { seller: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single product by ID.
 */
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: { select: { id: true, name: true } } },
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

/**
 * Get products for a specific seller.
 */
const getSellerProducts = async (sellerId) => {
  return prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Update a product (seller only, must own it).
 */
const updateProduct = async (productId, sellerId, data) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404);
  if (product.sellerId !== sellerId) throw new AppError("Not authorized", 403);

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price && { price: Number(data.price) }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
};

/**
 * Delete (deactivate) a product.
 */
const deleteProduct = async (productId, sellerId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404);
  if (product.sellerId !== sellerId) throw new AppError("Not authorized", 403);

  return prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
};
