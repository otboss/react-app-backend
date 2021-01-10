import { DataTypes, ModelCtor, Sequelize } from "sequelize";
import { Config } from "../config/config";
import { Tables } from "./tables";

const Conn = new Sequelize(Config.getEnvironment().mysql_db, Config.getEnvironment().mysql_username, Config.getEnvironment().mysql_password, {
  host: Config.getEnvironment().mysql_domain,
  dialect: 'mysql'
});

const UsersModel = Conn.define(Tables.UsersTable.table, {
  [Tables.UsersTable.columns.user_id]: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  [Tables.UsersTable.columns.email]: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  [Tables.UsersTable.columns.username]: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  [Tables.UsersTable.columns.password]: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

const HardwareItemsModel = Conn.define(Tables.HardwareItemsTable.table, {
  [Tables.HardwareItemsTable.columns.item_id]: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  [Tables.HardwareItemsTable.columns.label]: {
    type: DataTypes.STRING,
    allowNull: false
  },
  [Tables.HardwareItemsTable.columns.image]: {
    type: DataTypes.STRING,
    allowNull: false
  },
  [Tables.HardwareItemsTable.columns.cost]: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  [Tables.HardwareItemsTable.columns.shipping_fee]: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  [Tables.HardwareItemsTable.columns.description]: {
    type: DataTypes.STRING,
    allowNull: false
  },
  [Tables.HardwareItemsTable.columns.rating]: {
    type: DataTypes.FLOAT(1.1),
    allowNull: true
  },
  [Tables.HardwareItemsTable.columns.category]: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

const ReviewsModel = Conn.define(Tables.ReviewsTable.table, {
  [Tables.ReviewsTable.columns.review_id]: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  [Tables.ReviewsTable.columns.message]: {
    type: DataTypes.STRING,
    allowNull: false
  },
  [Tables.ReviewsTable.columns.rating]: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
});

const OrdersModel = Conn.define(Tables.OrdersTable.table, {
  [Tables.OrdersTable.columns.order_id]: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  [Tables.OrdersTable.columns.tracking_number]: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

const OrderItemsModel = Conn.define(Tables.OrderItemsTable.table, {
  [Tables.OrderItemsTable.columns.order_item_id]: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  [Tables.OrderItemsTable.columns.quantity]: {
    type: DataTypes.FLOAT(3, 1),
    allowNull: false
  },
});

UsersModel.hasMany(ReviewsModel, {
  "foreignKey": Tables.UsersTable.columns.user_id
});
ReviewsModel.belongsTo(UsersModel);
UsersModel.hasMany(OrdersModel, {
  "foreignKey": Tables.UsersTable.columns.user_id
});
OrdersModel.belongsTo(UsersModel);
OrdersModel.hasMany(OrderItemsModel, {
  "foreignKey": Tables.OrdersTable.columns.order_id
});
OrderItemsModel.belongsTo(OrdersModel);
HardwareItemsModel.hasMany(OrderItemsModel, {
  "foreignKey": Tables.HardwareItemsTable.columns.item_id,
});
OrderItemsModel.belongsTo(HardwareItemsModel);
HardwareItemsModel.hasMany(ReviewsModel, {
  "foreignKey": Tables.HardwareItemsTable.columns.item_id
});
ReviewsModel.belongsTo(HardwareItemsModel);

export abstract class Model {
  public static Users: ModelCtor<any> = UsersModel;
  public static HardwareItems: ModelCtor<any> = HardwareItemsModel;
  public static Reviews: ModelCtor<any> = ReviewsModel;
  public static Orders: ModelCtor<any> = OrdersModel;
  public static OrderItems: ModelCtor<any> = OrderItemsModel;
}

// Model.HardwareItems.create({
//   "label": "Rubber Mallet",
//   "image": "/assets/rubber_mallet.png",
//   "cost": 240.00,
//   "shipping_fee": 10.00,
//   "description": "Standard issue rubber mallet",
//   "category": "Tools",
// });

export default Conn;