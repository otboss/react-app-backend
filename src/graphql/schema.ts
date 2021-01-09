import { buildSchema } from "graphql"

export const schema = buildSchema(`
type Query {
  hello: String
  reviews(offset: Int, limit: Int, itemId: Int!): [Review]
  hardwareItems(offset: Int, limit: Int): [HardwareItem]
  orders(offset: Int, limit: Int, userId: Int!): [Orders]
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

type Orders {
  order_id: ID!
  tracking_number: Int!
}

type Review {
  review_id: ID!
  user: User!
  message: String!
  rating: Float!
}

type OrderItems {
  order_item_id: ID!
  item: HardwareItem!
  quantity: Float!
}
`);