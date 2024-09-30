const { pgTable, varchar, jsonb } = require("drizzle-orm/pg-core");

const sensitivityRules = pgTable("sensitivity_rules", {
  id: varchar("id", { length: 255 }).primaryKey(),
  basis_system: varchar("basis_system", { length: 255 }).notNull(),
  basis_code: varchar("basis_code", { length: 255 }).notNull(),
  basis_display: varchar("basis_display", { length: 255 }).notNull(),
  labels: jsonb("labels").notNull(),
  code_sets: jsonb("code_sets").notNull()
});

module.exports = { sensitivityRules };