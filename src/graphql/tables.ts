export namespace Tables {

  export const UsersTable = Object.freeze({
    "table": "users",
    "columns": {
      "user_id": "user_id",
      "email": "email",
      "username": "username",
      "password": "password",
      "createdAt": "createdAt",
      "updatedAt": "updatedAt",
    }
  });

  export const HardwareItemsTable = Object.freeze({
    "table": "hardware_items",
    "columns": {
      "item_id": "item_id",
      "label": "label",
      "image": "image",
      "cost": "cost",
      "shipping_fee": "shipping_fee",
      "description": "description",
      "rating": "rating",
      "category": "category",
      "createdAt": "createdAt",
      "updatedAt": "updatedAt",
    }
  });

  export const ReviewsTable = Object.freeze({
    "table": "reviews",
    "columns": {
      "review_id": "review_id",
      "user_id": "user_id",
      "item_id": "item_id",
      "message": "message",
      "rating": "rating",
      "createdAt": "createdAt",
      "updatedAt": "updatedAt",
    }
  });

  export const OrdersTable = Object.freeze({
    "table": "orders",
    "columns": {
      "order_id": "order_id",
      "tracking_number": "tracking_number",
      "user_id": "user_id",
      "createdAt": "createdAt",
      "updatedAt": "updatedAt",
    }
  });

  export const OrderItemsTable = Object.freeze({
    "table": "order_items",
    "columns": {
      "order_item_id": "order_item_id",
      "order_id": "order_id",
      "item_id": "item_id",
      "quantity": "quantity",
      "createdAt": "createdAt",
      "updatedAt": "updatedAt",
    }
  });

}