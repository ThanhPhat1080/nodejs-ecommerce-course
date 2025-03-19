export const mockDiscountAppliesAll = {
  discount_name: 'Spring Sale',
  discount_description: 'Get 20% off on all items during the spring sale!',
  discount_type: 'percentage', // or "fixed_amount"
  discount_value: 20, // 20% discount
  discount_code: 'SPRING20',
  discount_start_date: new Date('2025-03-01'),
  discount_end_date: new Date('2025-03-31'),
  discount_max_uses: 100, // Maximum 100 uses
  discount_uses_count: 0, // Initially 0 uses
  discount_users_used: [], // No users have used it yet
  discount_max_uses_per_user: 1, // Each user can use it once
  discount_min_order_value: 50, // Minimum order value of $50
  discount_shopId: '605c72ef2f799e2a4c8b4567', // Example shop ObjectId
  discount_is_active: true, // Discount is active
  discount_applies_to: 'all', // Applies to all products
  discount_product_ids: [], // Empty because it applies to all products
};

export const mockDiscountAppliesSpecific = {
  discount_name: 'Spring Sale',
  discount_description: 'Get 2$ off on all items during the spring sale!',
  discount_type: 'fixed_amount', // or "fixed_amount"
  discount_value: 2, // 2$ discount
  discount_code: 'SPRING2',
  discount_start_date: new Date('2025-04-01'),
  discount_end_date: new Date('2025-04-31'),
  discount_max_uses: 100, // Maximum 100 uses
  discount_uses_count: 0, // Initially 0 uses
  discount_users_used: [], // No users have used it yet
  discount_max_uses_per_user: 1, // Each user can use it once
  discount_min_order_value: 50, // Minimum order value of $50
  discount_shopId: '605c72ef2f799e2a4c8b4567', // Example shop ObjectId
  discount_is_active: true, // Discount is active
  discount_applies_to: 'specific', // Applies to all products
  discount_product_ids: [], // Empty because it applies to all products
};
