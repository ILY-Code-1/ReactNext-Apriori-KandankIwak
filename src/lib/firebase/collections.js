export const COL = {
  PRODUCTS: "products",
  TRANSACTIONS: "transactions",
  RULES: "rules",
  ORDERS: "orders",
  ADMINS: "admins",
};

export const ORDER_STATUS = {
  ORDERED: "ordered",
  PAID: "paid",
  SHIPPED: "shipped",
  COMPLETED: "completed",
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.ORDERED,
  ORDER_STATUS.PAID,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.COMPLETED,
];

export const TRANSACTION_SOURCE = {
  CHECKOUT: "checkout",
  SEED: "seed",
};
