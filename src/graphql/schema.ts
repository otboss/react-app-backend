import { buildSchema } from "graphql"

export const schema = buildSchema(`
type Query {
  hello: String
  reviews(itemId: Int): [Reviews]
  hardwareItems(offset: Int, limit: Int): [HardwareItems]
}

type Users {
  userId: ID!
  email: String!
  username: String!
  password: String!
}

type HardwareItems {
  itemId: ID!
  label: String!
  image: String!
  cost: Float!
  shipping_fee: Float!
  description: String!
  category: String!
}

type Reviews {
  reviewId: ID!
  itemId: ID!
  userId: ID!
  message: String!
  rating: Float!
}

type OrderItems {
  orderItemId: ID!
  userId: ID!
  itemId: ID!
  quantity: Float!
}

type Orders {
  orderId: ID!
  userId: ID!
  tracking_number: Int!
  orders: [OrderItems!]!
}
`);