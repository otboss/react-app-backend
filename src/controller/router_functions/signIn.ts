import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { resolvers } from "../../graphql/resolvers";
import { User } from "../../misc/User";
import { Config } from "../../config/config";

const signIn = async function (req, res) {
  const user: User = req.body;
  user.password = crypto.createHash('sha256').update(user.password).digest('hex');
  const previousUser: User = await resolvers.user(user);
  if (previousUser == null) {
    // TODO: Implement spam bot protection
    res.status(401).json({
      "error": "invalid email or password"
    });
    return;
  }
  const token = await jwt.sign({ user }, Config.getEnvironment().jwt_shared_secret, { expiresIn: '1h' });
  res.status(200).send(token);
}

export default signIn;