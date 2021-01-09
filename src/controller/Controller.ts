import requestLimiter from "./middleware/request-limiter";
import signUp from "./router_functions/signUp";
import signIn from "./router_functions/signIn";

export namespace Controller {
  export const Middleware = Object.freeze({
    /**
     * Request Rate Limiter Middleware
     * limits requests per ip address to 1200 per hour
     * */
    requestLimiter: requestLimiter
  })

  export const RouterFunctions = Object.freeze({
    signUp: signUp,
    signIn: signIn
  });
}