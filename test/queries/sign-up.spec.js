const fetch = require("node-fetch");
const assert = require("assert");
const Model = require("../../dist/src/graphql/db").Model;
const Tables = require("../../dist/src/graphql/tables").Tables;
const constants = require("../constants/constants");
const Config = require("../../dist/src/config/config").Config;

describe("Sign Up", () => {

  it("Should create a new account", async () => {
    await Model.Users.destroy({
      where: {
        [Tables.UsersTable.columns.email]: constants.user.email
      },
      logging: false
    });
    const response = await fetch(`${Config.baseURL}${Config.routes.signUp}`, {
      "method": "POST",
      "body": `
      {"email":"${constants.user.email}", "username":"${constants.user.username}", "password": "${constants.user.password}"}
      `,
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 201);
  });

});