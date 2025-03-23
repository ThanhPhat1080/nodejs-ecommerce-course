import cartModel from '../cart.model.js';

export const createUserCartWithProduct = async ({ product, userId }) => {
  const query = { cart_userId: userId, cart_state: 'active' };

  return await cartModel
    .findOneAndUpdate(
      query,
      {
        $set: { cart_product_count: 1 },
        $addToSet: {
          cart_products: { ...product, quantity: 1 },
        },
      },
      {
        upsert: true,
        new: true,
      },
    )
    .lean()
    .exec();
};

export const updateUserCartProductQuantity = async ({ product, userId }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    cart_state: 'active',
  };

  const updatedCart = await cartModel
    .findOneAndUpdate(
      { ...query, 'cart_products.productId': productId },
      {
        $inc: { 'cart_products.$.quantity': quantity }, // Increment/decrement the quantity
      },
      {
        new: true,
      },
    )
    .lean();

  if (!updatedCart) {
    return await cartModel
      .findOneAndUpdate(
        query,
        {
          $push: { cart_products: { ...product, quantity } }, // Add the product to the cart
        },
        {
          upsert: true, // Create a new cart if it doesn't exist
          new: true,
        },
      )
      .lean();
  }

  return updatedCart;
};

export const findUserCart = async ({ userId, state = 'active' }) => {
  return await cartModel.findOne({ cart_userId: userId, cart_state: state }).lean().exec();
};

export const deleteProductInCard = async ({ userId, productId }) => {
  // Delete product in cart
  const query = {
    cart_userId: userId,
    cart_state: 'active',
  };

  return await cartModel
    .updateOne(query, {
      $pull: { cart_products: { productId } },
      $inc: { cart_product_count: -1 },
    })
    .lean();
};
