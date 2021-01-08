import requestLimiter from "./middleware/request-limiter";
import auth from "./router_functions/auth";

export namespace Controller {

  export abstract class Middleware {
    /**
     * Request Rate Limiter Middleware
     * limits requests per ip address to 1200 per hour
     * */
    public static requestLimiter = requestLimiter;
  }

  export abstract class RouterFunctions {
    public static auth = auth;
  }
}