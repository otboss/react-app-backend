import { HardwareItem } from "../misc/HardwareItem";
import { Order } from "../misc/Order";
import { OrderItem } from "../misc/OrderItem";
import { Review } from "../misc/Review";
import { Model } from "./db";
import { Tables } from "./tables";

const Query = {
  hello: async () => {
    return 'Hello world!';
  },
  hardwareItems: async (args: HardwareItemsArgs): Promise<Array<HardwareItem>> => {
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    return await Model.HardwareItems.findAll({
      offset: args.offset,
      limit: args.limit,
    });
  },
  reviews: async (args: ReviewsArgs): Promise<Array<Review>> => {
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    const reviews: Array<Review> = await Model.Reviews.findAll({
      offset: args.offset,
      limit: args.limit,
      where: {
        [Tables.ReviewsTable.columns.item_id]: args.itemId
      }
    });
    for (let x = 0; x < reviews.length; x++) {
      const review = reviews[x];
      review.user = await Model.Users.findOne({
        where: {
          [Tables.UsersTable.columns.user_id]: review.user_id
        }
      });
      delete review.user.password;
    }
    return reviews;
  },
  orders: async (args: OrdersArgs): Promise<Array<Order>> => {
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    return await Model.Orders.findAll({
      offset: args.offset,
      limit: args.limit,
      where: {
        [Tables.OrdersTable.columns.user_id]: args.userId,
      }
    });
  },
  orderItems: async (args: OrderItemsArgs): Promise<Array<OrderItem>> => {
    const orderItems: Array<OrderItem> = await Model.OrderItems.findAll({
      offset: args.offset,
      limit: args.limit,
      where: {
        [Tables.OrderItemsTable.columns.order_id]: args.orderId,
      }
    });
    for (let x = 0; x < orderItems.length; x++) {
      const orderItem: OrderItem = orderItems[x];
      orderItem.item = await Model.HardwareItems.findOne({
        where: {
          [Tables.HardwareItemsTable.columns.item_id]: orderItem.item_id,
        }
      });
    }
    return orderItems;
  },
}

const Mutation = {
  saveReview: (offset: number, limit: number) => {
    return [];
  },
}

interface HardwareItemsArgs {
  offset: number;
  limit: number;
}

interface ReviewsArgs {
  itemId: number;
  offset: number;
  limit: number;
}

interface OrdersArgs {
  userId: number;
  offset: number;
  limit: number;
}

interface OrderItemsArgs {
  orderId: number;
  offset: number;
  limit: number;
}

export const resolvers = {
  ...Query,
  ...Mutation,
};