const fetch = require("node-fetch");
const assert = require("assert");
const constants = require("../constants");
const Config = require("../../dist/src/config/config").Config;

describe("Queries", () => {

  it("Should get hardware items", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": ` query{hardwareItems {item_id,label,image,rating,description,cost,shipping_fee}}`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
    constants.hardware_item = responseJSON["data"];
  });

  it("Should get reviews hardware items", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": `query{ reviews(item_id: ${constants.hardware_item.item_id}){ review_id }`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
  });

  it("Should get orders", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": ` query{  orders(filter:"", token: "${constants.user.token}"){ order_id } }`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
    constants.order_id = responseJSON["data"]["orders"]["order_id"];
  });

  it("Should get order items", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": ` orderItems{  orders(filter:"", token: "${constants.user.token}", order_id: "${constants.order_id}"){ item, quantity } }`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
  });

});