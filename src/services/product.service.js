import { BadRequestError } from '../core/error.response.js';
import { clothingModel, electronicsModel, productModel } from '../models/product.model.js';
import * as InventoryRepo from '../models/repositories/inventory.repo.js';
import * as ProductRepo from '../models/repositories/product.repo.js';

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(productId) {
    const newProduct = await productModel.create({ ...this, _id: productId });
    if (!newProduct) {
      throw new BadRequestError('Product not created');
    }

    // Add product to inventory
    InventoryRepo.insertInventory({
      productId: newProduct._id,
      shopId: this.product_shop,
      stock: this.product_quantity,
      location: 'Da Nang',
    });

    return newProduct;
  }

  async updateProduct(productId) {
    return await ProductRepo.updateProductById({
      product_id: productId,
      payload: { ...this },
      model: productModel,
    });
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronicsModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError('Electronic not created');
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Product not created');
    }

    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError('Clothing not created');
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Product not created');
    }

    return newProduct;
  }

  async updateProduct(productId) {
    if (this.product_attributes) {
      await ProductRepo.updateProductById({
        product_id: productId,
        payload: { ...this.product_attributes },
        model: clothingModel,
      });
    }

    return await super.updateProduct(productId);
  }
}

class ProductServices {
  static registry = new Map();

  static async createProduct(type, payload) {
    const ProductClass = this.registry.get(type);
    if (!ProductClass) {
      throw new BadRequestError('Invalid product type: ' + type);
    }

    return await new ProductClass(payload).createProduct();
  }

  static async updateProduct(productId, payload) {
    const ProductClass = this.registry.get(payload.product_type);
    if (!ProductClass) {
      throw new BadRequestError('Invalid product type: ' + payload.product_type);
    }

    return await new ProductClass(payload).updateProduct(productId);
  }

  static registerProductType(type, ProductClass) {
    if (this.registry.has(type)) {
      throw new BadRequestError('Product type already exists: ' + type);
    }
    this.registry.set(type, ProductClass);
  }

  static updateProductType(type, ProductClass) {
    if (!this.registry.has(type)) {
      throw new BadRequestError('Product type does not exist: ' + type);
    }
    this.registry.set(type, ProductClass);
  }

  /////////////////////// QUERY ////////////////////////////////////////
  static async findAllDraftProductsForShop({ product_shop, limit = 50, skip = 0 }) {
    return await ProductRepo.findAllDraftProductsForShop({ product_shop, limit, skip });
  }

  static async findAllPublishProductsForShop({ product_shop, limit = 50, skip = 0 }) {
    return await ProductRepo.findAllPublishProductsForShop({ product_shop, limit, skip });
  }

  static async searchProductsByUser(keyword) {
    return await ProductRepo.searchProducts(keyword, { isPublished: true, isDraft: false });
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await ProductRepo.findAllProducts({
      select: ['product_name', 'product_thumb', 'product_price', 'product_type'],
      limit,
      sort,
      page,
      filter,
    });
  }

  static async findProduct({ product_id, unselect = [] }) {
    return await ProductRepo.findProduct({ product_id, unselect: [...unselect, '__v'] });
  }

  ///////////////////// PUT //////////////////////////////////////////
  static async publishProductByShop({ product_id, product_shop }) {
    return await ProductRepo.publishProductByShop({ product_id, product_shop });
  }

  static async unpublishProductByShop({ product_id, product_shop }) {
    return await ProductRepo.unpublishProductByShop({ product_id, product_shop });
  }
}

// Register the new product type
ProductServices.registerProductType('Electronics', Electronics);
ProductServices.registerProductType('Clothing', Clothing);

export default ProductServices;
