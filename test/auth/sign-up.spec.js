const fetch = require("node-fetch");
const assert = require("assert");
const constants = require("../constants");
const Config = require("../../dist/src/config/config").Config;

describe("Sign Up", () => {

  it("Should create a new account", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.signUp}`, {
      "method": "POST",
      "body": JSON.stringify({
        "email": constants.user.email,
        "username": constants.user.username,
        "password": constants.user.password
      }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert.strictEqual(response.status, 201);
  });

});