import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const pilotRequestStatuses = ["pending", "approved", "declined"] as const;
export type PilotRequestStatus = (typeof pilotRequestStatuses)[number];

export const apiRateLimits = pgTable(
  "api_rate_limits",
  {
    key: text("key").primaryKey(),
    requestCount: integer("request_count").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    check("api_rate_limits_key_length", sql`char_length(${table.key}) = 64`),
    check("api_rate_limits_request_count_positive", sql`${table.requestCount} > 0`),
    index("api_rate_limits_expires_at_idx").on(table.expiresAt),
  ],
).enableRLS();

export const accessGrants = pgTable(
  "access_grants",
  {
    email: text("email").primaryKey(),
    grantedAt: timestamp("granted_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    grantedBy: text("granted_by").notNull(),
  },
  (table) => [
    check("access_grants_email_normalized", sql`${table.email} = lower(btrim(${table.email}))`),
    check("access_grants_email_length", sql`char_length(${table.email}) between 3 and 254`),
  ],
).enableRLS();

export const pilotRequests = pgTable(
  "pilot_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    organization: text("organization").notNull(),
    status: text("status").$type<PilotRequestStatus>().notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: "date" }),
    reviewedBy: text("reviewed_by"),
  },
  (table) => [
    check("pilot_requests_email_normalized", sql`${table.email} = lower(btrim(${table.email}))`),
    check("pilot_requests_email_length", sql`char_length(${table.email}) between 3 and 254`),
    check(
      "pilot_requests_status_check",
      sql`${table.status} in ('pending', 'approved', 'declined')`,
    ),
    check(
      "pilot_requests_organization_length",
      sql`char_length(btrim(${table.organization})) between 1 and 120`,
    ),
    check(
      "pilot_requests_review_fields",
      sql`(${table.status} = 'pending' and ${table.reviewedAt} is null and ${table.reviewedBy} is null)
        or (${table.status} <> 'pending' and ${table.reviewedAt} is not null and ${table.reviewedBy} is not null)`,
    ),
    index("pilot_requests_status_created_at_idx").on(table.status, table.createdAt.desc()),
    uniqueIndex("pilot_requests_email_unique_idx").on(table.email),
    pgPolicy("Public can submit minimal pilot requests", {
      for: "insert",
      to: ["anon", "authenticated"],
      withCheck: sql`
        ${table.status} = 'pending'
        and ${table.reviewedAt} is null
        and ${table.reviewedBy} is null
        and ${table.email} = lower(btrim(${table.email}))
        and char_length(${table.email}) between 3 and 254
        and char_length(btrim(${table.organization})) between 1 and 120
      `,
    }),
  ],
).enableRLS();
