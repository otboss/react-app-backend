const fetch = require("node-fetch");
const assert = require("assert");
const constants = require("../constants");
const Config = require("../../dist/src/config/config").Config;

describe("Sign In", () => {

  it("Should sign into account", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.signIn}`, {
      "method": "POST",
      "body": JSON.stringify({
        "email": constants.user.email,
        "password": constants.user.password
      }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert.strictEqual(response.status, 200);
    constants.user.token = await response.text();
  });
});