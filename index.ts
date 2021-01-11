import * as express from "express";
import Conn from "./src/graphql/db";
import { graphqlHTTP } from "express-graphql";
import { Config } from "./src/config/config";
import { schema } from "./src/graphql/schema";
import { resolvers } from "./src/graphql/resolvers";
import { Controller } from "./src/controller/Controller";

const app = express();
app.use(express.json());
app.use(Controller.Middleware.requestLimiter);
app.use(Config.routes.app, express.static('www'));
app.use(Config.routes.assets, express.static('assets'));
app.use(Config.routes.graphql, graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.post(Config.routes.signUp, Controller.RouterFunctions.signUp);
app.post(Config.routes.signIn, Controller.RouterFunctions.signIn);
app.get("*", (_, res) => { res.redirect(Config.routes.app) });

Conn.sync({ force: false }).then(() => {
  console.log(`Running a GraphQL API server at ${Config.baseURL}${Config.routes.graphql}`);
  app.listen(Config.getEnvironment().backend_port);
});
