import { buildSchema } from "graphql"

export const schema = buildSchema(`
type Query {
  hello: String
  reviews(offset: Int, limit: Int, itemId: Int!): [Review]
  hardwareItems(offset: Int, limit: Int): [HardwareItem]
  orders(offset: Int, limit: Int, userId: Int!): [Order]
  orderItems(token: String!, order_id: Int!, offset: Int, limit: Int): [OrderItem]
}

type Mutation {
  saveReview(review: ReviewInput): Review
  saveOrder(order: OrderInput): Order
  saveOrderItem(orderItem: OrderItemInput): OrderItem
}

input ReviewInput {
  token: String!
  item_id: String!
  message: String!
  rating: Float!
}

input OrderInput{
  token: String!
}

input OrderItemInput{
  order_id: Int!
  item_id: Int!
  quantity: Float!
  token: String!
}

type User {
  user_id: ID!
  email: String!
  username: String!
  password: String!
}

type HardwareItem {
  item_id: ID!
  label: String!
  image: String!
  cost: Float!
  shipping_fee: Float!
  description: String!
  category: String!
  rating: Float!
}

type Order {
  order_id: ID!
  tracking_number: Int!
}

type Review {
  review_id: ID!
  user: User!
  message: String!
  rating: Float!
}

type OrderItem {
  order_item_id: ID!
  item: HardwareItem!
  quantity: Float!
}
`);