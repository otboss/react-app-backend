import { Sequelize } from "sequelize";
import { Config } from "../config/config";

const Conn = new Sequelize(Config.getEnvironment().mysql_db, Config.getEnvironment().mysql_username, Config.getEnvironment().mysql_password, {
  host: Config.getEnvironment().mysql_db,
  dialect: 'mysql'
});

const UsersModel = Conn.define("users", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.INT,
    allowNull: false
  }
});

const HardwareItemsModel = Conn.define("hardware_items", {
  item_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cost: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  shipping_fee: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const ReviewsModel = Conn.define("reviews", {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.INT,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.INT,
    allowNull: false
  }
})

const OrdersModel = Conn.define("orders", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.INT,
    allowNull: false
  }
});

// const Sectors = Conn.define('sectors', {
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// Sectors.sync({ force: true }).then(function () {
//   return Sectors.create({
//     name: 'test'
//   });
// });

Conn.sync({ force: true });

const Users = Conn.model["users"];
const HardwareItems = Conn.model["hardware_items"];
const Reviews = Conn.model["reviews_model"];
const Orders = Conn.model["orders"];

exports.default = Conn;