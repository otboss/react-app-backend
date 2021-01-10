import * as jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Config } from "../config/config";
import { HardwareItem } from "../misc/HardwareItem";
import { Order } from "../misc/Order";
import { OrderItem } from "../misc/OrderItem";
import { Review } from "../misc/Review";
import { User } from "../misc/User";
import { Model } from "./db";
import { Tables } from "./tables";

const Query = {
  userFromUsername: async (args: User): Promise<User> => {
    return await Model.Users.findOne({
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Op.or]: [
          { [Tables.UsersTable.columns.username]: args.username, },
          { [Tables.UsersTable.columns.email]: args.email, }
        ]
      },
    });
  },
  user: async (args: User): Promise<User> => {
    return await Model.Users.findOne({
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.UsersTable.columns.email]: args.email,
        [Tables.UsersTable.columns.password]: args.password,
      },
    });
  },
  hardwareItems: async (args: HardwareItemsArgs): Promise<Array<HardwareItem>> => {
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    return await Model.HardwareItems.findAll({
      offset: args.offset,
      limit: args.limit,
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.HardwareItemsTable.columns.label]: {
          [Op.like]: `%${args.filter}%`,
        }
      }
    });
  },
  reviews: async (args: ReviewsArgs): Promise<Array<Review>> => {
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    const reviews: Array<Review> = await Model.Reviews.findAll({
      offset: args.offset,
      limit: args.limit,
      logging: Config.getEnvironment().mysql_query_logging,
      order: [
        [Tables.ReviewsTable.columns.createdAt, 'DESC'],
      ],
      where: {
        [Tables.ReviewsTable.columns.item_id]: args.item_id
      }
    });
    for (let x = 0; x < reviews.length; x++) {
      const review = reviews[x];
      review.user = await Model.Users.findOne({
        logging: Config.getEnvironment().mysql_query_logging,
        where: {
          [Tables.UsersTable.columns.user_id]: review.user_id
        }
      });
      delete review.user.email;
      delete review.user.password;
    }
    return reviews;
  },
  order: async (args: OrderArgs): Promise<Order> => {
    const user: User = (await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret))["user"];
    const previousUser: User = await Query.user(user);
    return await Model.Orders.findOne({
      logging: Config.getEnvironment().mysql_query_logging,
      order: [
        [Tables.OrdersTable.columns.createdAt, 'DESC'],
      ],
      where: {
        [Tables.OrdersTable.columns.user_id]: previousUser.user_id,
        [Tables.OrdersTable.columns.order_id]: args.order_id,
      }
    });
  },
  orders: async (args: OrdersArgs): Promise<Array<Order>> => {
    const user: User = (await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret))["user"];
    const previousUser: User = await Query.user(user);
    args.offset = args.offset == null ? 0 : args.offset;
    args.limit = args.limit == null ? 40 : args.limit;
    return await Model.Orders.findAll({
      offset: args.offset,
      limit: args.limit,
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.OrdersTable.columns.user_id]: previousUser.user_id,
      }
    });
  },
  orderItems: async (args: OrderItemsArgs): Promise<Array<OrderItem>> => {
    let user: User = (await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret))["user"];
    user = await Query.user(user);
    const order: Order = await Model.Orders.findOne({
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.OrdersTable.columns.order_id]: args.order_id,
      }
    });
    if (user.user_id != order.user_id) throw "not authorized";
    const orderItems: Array<OrderItem> = await Model.OrderItems.findAll({
      offset: args.offset,
      limit: args.limit,
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.OrderItemsTable.columns.order_id]: args.order_id,
      }
    });
    for (let x = orderItems.length - 1; x > -1; x--) {
      const orderItem: OrderItem = orderItems[x];
      orderItem.item = await Model.HardwareItems.findOne({
        logging: Config.getEnvironment().mysql_query_logging,
        where: {
          [Tables.HardwareItemsTable.columns.item_id]: orderItem.item_id,
          [Tables.HardwareItemsTable.columns.label]: {
            [Op.like]: `%${args.filter}%`,
          }
        }
      });
      if (orderItem.item == null) orderItems.splice(x, 1);
    }
    return orderItems;
  },
}

const Mutation = {
  saveReview: async (args: ReviewSaveArgs): Promise<Review> => {
    if (args.message.length == 0) throw "message must not be empty";
    let user: User = (await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret))["user"];
    user = await Query.user(user);
    delete user.password;
    const review: Review = new Review();
    review.item_id = args.item_id
    review.user_id = user.user_id;
    review.message = args.message;
    review.rating = parseInt((args.rating > 5 ? 5 : args.rating < 1 ? 1 : args.rating).toString());
    const hardwareItem: HardwareItem = await Model.HardwareItems.findOne({
      logging: Config.getEnvironment().mysql_query_logging,
      where: {
        [Tables.HardwareItemsTable.columns.item_id]: review.item_id
      }
    });
    if (hardwareItem == null) throw "review item not found"
    await hardwareItem["update"]({
      [Tables.HardwareItemsTable.columns.rating]: (hardwareItem.rating + review.rating) / 2,
    }, {
      logging: Config.getEnvironment().mysql_query_logging,
    });
    const reviewId: number = (await Model.Reviews.create({
      [Tables.ReviewsTable.columns.user_id]: review.user_id,
      [Tables.ReviewsTable.columns.message]: review.message,
      [Tables.ReviewsTable.columns.rating]: review.rating,
      [Tables.ReviewsTable.columns.item_id]: review.item_id,
    }, {
      logging: Config.getEnvironment().mysql_query_logging,
    }))["dataValues"][Tables.ReviewsTable.columns.review_id];
    review.review_id = reviewId;

    review.user = user;
    return review;
  },
  saveOrder: async (args: OrderSaveArgs): Promise<Order> => {
    if (args.order_items.length == 0) throw "must provide order items";
    let user: User = (await jwt.verify(args.token, Config.getEnvironment().jwt_shared_secret))["user"];
    user = await Query.user(user);
    const order = new Order();
    order.tracking_number = Math.random().toString().slice(2);
    order.user_id = user.user_id;
    const insertId: number = (await Model.Orders.create({
      [Tables.OrdersTable.columns.tracking_number]: order.tracking_number,
      [Tables.OrdersTable.columns.user_id]: order.user_id,
    }, {
      logging: Config.getEnvironment().mysql_query_logging,
    }))["dataValues"][Tables.OrdersTable.columns.order_id];
    for (let x = 0; x < args.order_items.length; x++) {
      const orderItem: OrderItem = args.order_items[x];
      orderItem.order_id = insertId;
      await Model.OrderItems.create({
        [Tables.OrderItemsTable.columns.item_id]: orderItem.item_id,
        [Tables.OrderItemsTable.columns.order_id]: orderItem.order_id,
        [Tables.OrderItemsTable.columns.quantity]: orderItem.quantity,
      }, {
        logging: Config.getEnvironment().mysql_query_logging,
      });
    }
    order.order_id = insertId;
    return order;
  },
  saveUser: async (args: User): Promise<User> => {
    await Model.Users.create({
      [Tables.UsersTable.columns.email]: args.email,
      [Tables.UsersTable.columns.password]: args.password,
      [Tables.UsersTable.columns.username]: args.username,
    }, {
      logging: Config.getEnvironment().mysql_query_logging,
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
  token: string;
  order_items: Array<OrderItem>;
}

interface HardwareItemsArgs {
  offset: number;
  limit: number;
  filter: string;
}

interface ReviewsArgs {
  item_id: number;
  offset: number;
  limit: number;
}

interface OrderArgs {
  order_id: number;
  token: string;
  filter: string;
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
  filter: string;
}

export const resolvers = {
  ...Query,
  ...Mutation,
};