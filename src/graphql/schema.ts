import { buildSchema } from "graphql"

export const schema = buildSchema(`
type Query {
  reviews(offset: Int, limit: Int, item_id: Int!): [Review]
  hardwareItems(filter: String!, offset: Int, limit: Int): [HardwareItem]
  orders(token: String!, filter: String!, offset: Int, limit: Int): [Order]
  orderItems(token: String!, filter: String!, order_id: Int!, offset: Int, limit: Int): [OrderItem]
}

type Mutation {
  saveReview(token: String!, item_id: Int!, message: String!, rating: Int!): Review
  saveOrder(token: String!, order_items: [OrderItemInput!]!): Order
}

input OrderItemInput{
  item_id: Int!
  quantity: Float!
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