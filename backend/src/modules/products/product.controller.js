const asyncHandler = require("../../utils/asyncHandler");
const productService = require("./product.service");

exports.create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.user.id, req.body);
  res.status(201).json({ success: true, product });
});

exports.getAll = asyncHandler(async (_req, res) => {
  const products = await productService.getAllProducts();
  res.json({ success: true, products });
});

exports.getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, product });
});

exports.getMine = asyncHandler(async (req, res) => {
  const products = await productService.getSellerProducts(req.user.id);
  res.json({ success: true, products });
});

exports.update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.user.id, req.body);
  res.json({ success: true, product });
});

exports.remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id, req.user.id);
  res.json({ success: true, message: "Product deactivated" });
});
