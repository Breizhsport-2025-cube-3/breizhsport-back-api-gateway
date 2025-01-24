import { Dialect, Sequelize } from "sequelize";

const allowedDialects: Dialect[] = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];
const dialect = process.env.DB_DIALECT as Dialect;

if (!allowedDialects.includes(dialect)) {
  throw new Error(`Dialect invalide : ${dialect}. Valeurs autorisées : ${allowedDialects.join(", ")}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "breizhsport",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect,
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "5", 10),
      min: parseInt(process.env.DB_POOL_MIN || "0", 10),
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
