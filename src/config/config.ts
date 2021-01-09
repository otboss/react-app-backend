import { Environment } from "../misc/Environment";

export abstract class Config {

  /** Returns environment variables*/
  public static getEnvironment(): Environment {
    //@ts-ignore
    const environment: Environment = process.env;
    return {
      "mysql_db": environment.mysql_db,
      "mysql_password": environment.mysql_password,
      "mysql_username": environment.mysql_username,
      "mysql_domain": environment.mysql_domain,
      "mysql_port": environment.mysql_port,
      "mysql_query_logging": environment.mysql_query_logging.toString() == "true",
      "backend_domain": environment.backend_domain,
      "backend_port": environment.backend_port,
      "jwt_shared_secret": environment.jwt_shared_secret,
    }
  }

  /** The base url of this application*/
  public static readonly baseURL: string = `${Config.getEnvironment().backend_domain}:${Config.getEnvironment().backend_port}`;

  /** The endpoints of this application*/
  public static routes = Object.freeze({
    index: "/",
    app: "/app",
    assets: "/assets",
    signUp: "/sign_up",
    signIn: "/sign_in",
    graphql: "/graphql",
  });

}