const fetch = require("node-fetch");
const assert = require("assert");
const constants = require("../constants");
const Config = require("../../dist/src/config/config").Config;
const Model = require("../../dist/src/graphql/db").Model;

describe("Mutations", () => {
  before(async () => {
    const item = {
      "label": "Rubber Mallet",
      "image": "/assets/rubber_mallet.png",
      "cost": 240.00,
      "shipping_fee": 10.00,
      "description": "Standard issue rubber mallet",
      "category": "Tools",
      "rating": 0,
    };
    // Create test item
    item.item_id = (await Model.HardwareItems.create(item,))["dataValues"]["item_id"];
    constants.hardware_item = item;
  })

  it("Should save order", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": ` mutation{  saveOrder(order_items:[{item_id: ${constants.hardware_item.item_id}, quantity: 1}], token: "${constants.user.token}"){ order_id } }`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
  });

  it("Should save review", async () => {
    const response = await fetch(`${Config.baseURL}${Config.routes.graphql}`, {
      "method": "POST",
      "body": JSON.stringify({ "query": ` mutation{  saveReview(token: "${constants.user.token}", item_id: ${constants.hardware_item.item_id}, message: "a good product", rating: 5){ review_id } }`, "variables": null }),
      "headers": { 'Content-Type': 'application/json' },
    });
    assert(response.status, 200);
    const responseJSON = await response.json();
    assert(typeof (responseJSON["error"]), "undefined");
  });
});