import * as express from "express";
import { graphqlHTTP } from "express-graphql";
import { Config } from "./src/config/config";
import { schema } from "./src/graphql/schema";
import { resolvers } from "./src/graphql/resolvers";
import { mutations } from "./src/graphql/mutations";
import { Controller } from "./src/controller/Controller";

const app = express();

app.use(Controller.Middleware.requestLimiter);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: { ...resolvers, ...mutations },
  graphiql: true,
}));

app.post(Config.routes.auth, Controller.RouterFunctions.auth);

console.log(`Running a GraphQL API server at ${Config.baseURL}/graphql`);
app.listen(Config.getEnvironment().backend_port);