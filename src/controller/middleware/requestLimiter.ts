import { IPAddress } from "../../misc/IPAddress";

let blockedUsers: Record<string, IPAddress> = {};

const requestLimiter = async function (req, res, next) {
  const ip: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let ipAddress: IPAddress = blockedUsers[ip];
  if (ipAddress == null) {
    ipAddress = new IPAddress(ip);
  }
  else if (Date.now() - ipAddress.timestamp >= 3600000) {
    ipAddress.count = 0;
    ipAddress.timestamp = Date.now();
  }
  if (ipAddress.count >= 1200) {
    res.status(401).send(JSON.stringify({}));
    return;
  }
  ipAddress.count++;
  blockedUsers[ip] = ipAddress;
  next();
}

setInterval(() => {
  blockedUsers = {};
}, 3600000);

export default requestLimiter;