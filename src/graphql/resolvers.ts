import * as jwt from "jsonwebtoken";
import { Config } from "../config/config";
import { HardwareItem } from "../misc/HardwareItem";
import { Order } from "../misc/Order";
import { OrderItem } from "../misc/OrderItem";
import { Review } from "../misc/Review";
import { User } from "../misc/User";
import { Model } from "./db";
import { Tables } from "./tables";

const Query = {
  hello: async () => {
    return 'Hello world!';
  },
  getUserByUsername: async (args: User): Promise<User> => {
    return await Model.Users.findOne({
      where: {
        [Tables.UsersTable.columns.username]: args.username,
      }
    });
  },
  user: async (args: User): Promise<User> => {
    return await Model.Users.findOne({
      where: {
        [Tables.UsersTable.columns.email]: args.email,
        [Tables.UsersTable.columns.password]: args.password,
      }
    });
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
        [Tables.ReviewsTable.columns.item_id]: args.item_id
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
  order: async (args: OrderArgs): Promise<Order> => {
    const user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    const previousUser: User = await Query.user(user);
    return await Model.Orders.findOne({
      where: {
        [Tables.OrdersTable.columns.user_id]: previousUser.user_id,
        [Tables.OrdersTable.columns.order_id]: args.order_id,
      }
    });
  },
  orders: async (args: OrdersArgs): Promise<Array<Order>> => {
    const user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    const previousUser: User = await Query.user(user);
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    return await Model.Orders.findAll({
      offset: args.offset,
      limit: args.limit,
      where: {
        [Tables.OrdersTable.columns.user_id]: previousUser.user_id,
      }
    });
  },
  orderItems: async (args: OrderItemsArgs): Promise<Array<OrderItem>> => {
    let user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    user = await Query.user(user);
    const order: Order = await Model.Orders.findOne({
      where: {
        [Tables.OrdersTable.columns.order_id]: args.order_id,
      }
    });
    if (user.user_id != order.user_id) {
      throw "not authorized";
    }
    const orderItems: Array<OrderItem> = await Model.OrderItems.findAll({
      offset: args.offset,
      limit: args.limit,
      where: {
        [Tables.OrderItemsTable.columns.order_id]: args.order_id,
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
  saveReview: async (args: ReviewSaveArgs): Promise<Review> => {
    let user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    user = await Query.user(user);
    const review: Review = new Review();
    review.item_id = args.item_id
    review.user_id = user.user_id;
    review.message = args.message;
    review.rating = Math.abs(args.rating % 5);
    await Model.Reviews.create({
      [Tables.ReviewsTable.columns.user_id]: review.user_id,
      [Tables.ReviewsTable.columns.message]: review.message,
      [Tables.ReviewsTable.columns.rating]: review.rating,
      [Tables.ReviewsTable.columns.item_id]: review.item_id,
    });
    return review;
  },
  saveOrder: async (args: OrderSaveArgs): Promise<Order> => {
    let user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    user = await Query.user(user);
    const order = new Order();
    order.tracking_number = Math.random().toString().slice(2);
    order.user_id = user.user_id;
    await Model.Orders.create({
      where: {
        [Tables.OrdersTable.columns.tracking_number]: order.tracking_number,
        [Tables.OrdersTable.columns.user_id]: order.user_id,
      }
    });
    return order;
  },
  saveOrderItem: async (args: OrderItemSaveArgs): Promise<OrderItem> => {
    let user: User = await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret);
    user = await Query.user(user);
    const order: Order = await Query.order({ "order_id": args.order_id, "token": args.token });
    if (order.user_id != user.user_id) {
      throw "not authorized";
    }
    const item: HardwareItem = await Model.HardwareItems.findOne({
      [Tables.HardwareItemsTable.columns.item_id]: args.item_id
    });
    const orderItem = new OrderItem();
    orderItem.item_id = args.item_id;
    orderItem.order_id = args.order_id;
    orderItem.quantity = args.quantity;
    orderItem.item = item;
    await Model.OrderItems.create({
      where: {
        [Tables.OrderItemsTable.columns.item_id]: orderItem.item_id,
        [Tables.OrderItemsTable.columns.order_id]: orderItem.order_id,
        [Tables.OrderItemsTable.columns.quantity]: orderItem.quantity,
      }
    });
    return orderItem;
  },
  saveUser: async (args: User): Promise<User> => {
    await Model.Users.create({
      [Tables.UsersTable.columns.email]: args.email,
      [Tables.UsersTable.columns.password]: args.password,
      [Tables.UsersTable.columns.username]: args.username,
    })
    return args;
  },
}

interface ReviewSaveArgs {
  token: string;
  item_id: number;
  message: string;
  rating: number;
}

interface OrderSaveArgs {
  token: string
}

interface OrderItemSaveArgs {
  order_id: number;
  item_id: number;
  quantity: number;
  token: string;
}

interface HardwareItemsArgs {
  offset: number;
  limit: number;
}

interface ReviewsArgs {
  item_id: number;
  offset: number;
  limit: number;
}

interface OrderArgs {
  order_id: number;
  token: string;
}


interface OrdersArgs {
  token: string;
  offset: number;
  limit: number;
  filter: string;
}

interface OrderItemsArgs {
  token: string;
  order_id: number;
  offset: number;
  limit: number;
}

export const resolvers = {
  ...Query,
  ...Mutation,
};