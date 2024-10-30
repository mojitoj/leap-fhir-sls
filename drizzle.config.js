require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "dev"}`
});

module.exports = {
  dialect: "postgresql",
  schema: "./db-schema/*.js",
  out: "./drizzle",
  schemaFilter: "public",
  tablesFilter: "*",
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
  verbose: true
};
