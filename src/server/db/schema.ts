// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `my-searcher_${name}`);

export const bangs = createTable("bangs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }),
  bang: varchar("bang", { length: 16 }),
  banglink: varchar("banglink", { length: 2048 }),
  creator: varchar("creator", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const customBangs = createTable(
  "customBangs",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    bang: varchar("bang", { length: 16 }),
    banglink: varchar("banglink", { length: 2048 }),
    creator: varchar("creator"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => {
    return {
      creatorIdx: index("creator_idx").on(table.creator),
      bangIdx: index("bang_idx").on(table.bang),
      bangLinkIdx: index("bang_link_idx").on(table.banglink),
    };
  },
);

export const userChoice = createTable(
  "userChoice",
  {
    userId: varchar("userId").primaryKey(),
    searchEngine: varchar("searchEngine", { length: 64 }),
  },
  (table) => {
    return {
      userIdIdx: index("userIdIdx").on(table.userId),
    };
  },
);
