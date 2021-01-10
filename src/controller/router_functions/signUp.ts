import * as crypto from "crypto";
import { resolvers } from "../../graphql/resolvers";
import { User } from "../../misc/User";

const signUp = async function (req, res) {
  const user: User = req.body;
  if (await resolvers.userFromUsername(user) != null) {
    res.status(403).json({
      "error": "username already taken"
    });
    return;
  }
  const usernameChecker: RegExp = /^[a-z][^\W_]{5,14}$/;
  if (!usernameChecker.test(user.username)) {
    res.status(403).json({
      "error": "invalid username provided"
    });
    return;
  }
  const emailChecker: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailChecker.test(user.email)) {
    res.status(403).json({
      "error": "invalid email address provided"
    });
    return;
  }
  const passwordChecker: RegExp = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  if (!passwordChecker.test(user.password)) {
    res.status(403).json({
      "error": "insecure password provided"
    });
    return;
  }
  user.password = crypto.createHash('sha256').update(user.password).digest('hex');
  await resolvers.saveUser(user);
  // TODO: Implement email verification
  res.status(201).json({});
}

export default signUp;