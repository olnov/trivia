const { Sequelize } = require("sequelize");
require("dotenv").config();

// Uncomment for NeonDB
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// Uncomment for local PostgreSQL
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: process.env.DB_DIALECT,
//   logging: false
// });

// Testing connection
const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("[DB-001] Successfully connected to the database.");
  } catch (error) {
    console.error("[DB-002] Error connecting to the database:", error);
  }
};

dbConnection();

// Synchronizing DB
const syncDatabase = async (force_mode = process.env.DB_FORCE_SYNC | false) => {
  try {
    await sequelize.sync({ force: force_mode }); // Use `force: true` to drop and recreate tables; remove it to only create missing tables
    console.log("[DB-003] Database synced successfully.");
  } catch (error) {
    console.error("[DB-004] Error syncing database:", error);
  }
};

module.exports = { sequelize, syncDatabase };
