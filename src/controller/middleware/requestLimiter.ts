import { IPAddress } from "../../misc/IPAddress";

let blockedUsers: Record<string, IPAddress> = {};

const requestLimiter = async function (req, res, next) {
  const ip: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ipAddress: IPAddress = blockedUsers[ip] == null ? new IPAddress(ip) : blockedUsers[ip];
  if (Date.now() - ipAddress.timestamp >= 3600000) {
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