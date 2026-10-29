import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  primaryKey,
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

export const demoMatterApprovals = pgTable(
  "demo_matter_approvals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matterId: text("matter_id").notNull(),
    versionHash: text("version_hash").notNull(),
    reviewerId: text("reviewer_id").notNull(),
    reviewerEmail: text("reviewer_email").notNull(),
    approvedAt: timestamp("approved_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("demo_matter_approvals_hash_length", sql`char_length(${table.versionHash}) = 64`),
    check(
      "demo_matter_approvals_reviewer_email_length",
      sql`char_length(${table.reviewerEmail}) between 3 and 254`,
    ),
    uniqueIndex("demo_matter_approvals_matter_version_unique_idx").on(
      table.matterId,
      table.versionHash,
    ),
    index("demo_matter_approvals_matter_approved_at_idx").on(
      table.matterId,
      table.approvedAt.desc(),
    ),
  ],
).enableRLS();

export const workspaceOrganizationTypes = ["consultancy", "law_firm", "in_house", "other"] as const;
export const workspaceMarkets = ["india", "united_states", "other"] as const;
export const workspaceTeamSizes = ["1", "2-5", "6-15", "16+"] as const;
export const workspaceFocuses = ["business", "student", "family", "other"] as const;

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    organizationType: text("organization_type", { enum: workspaceOrganizationTypes }).notNull(),
    market: text("market", { enum: workspaceMarkets }).notNull(),
    teamSize: text("team_size", { enum: workspaceTeamSizes }).notNull(),
    primaryFocus: text("primary_focus", { enum: workspaceFocuses }).notNull(),
    practiceAreas: text("practice_areas")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    officeLocation: text("office_location").notNull().default(""),
    deadlinePaddingDays: integer("deadline_padding_days").notNull().default(14),
    firmContext: text("firm_context").notNull().default(""),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    check("workspaces_name_length", sql`char_length(btrim(${table.name})) between 2 and 120`),
    check(
      "workspaces_organization_type_check",
      sql`${table.organizationType} in ('consultancy', 'law_firm', 'in_house', 'other')`,
    ),
    check("workspaces_market_check", sql`${table.market} in ('india', 'united_states', 'other')`),
    check("workspaces_team_size_check", sql`${table.teamSize} in ('1', '2-5', '6-15', '16+')`),
    check(
      "workspaces_primary_focus_check",
      sql`${table.primaryFocus} in ('business', 'student', 'family', 'other')`,
    ),
    check("workspaces_practice_areas_count", sql`cardinality(${table.practiceAreas}) <= 12`),
    check("workspaces_office_location_length", sql`char_length(${table.officeLocation}) <= 160`),
    check("workspaces_deadline_padding_range", sql`${table.deadlinePaddingDays} between 0 and 90`),
    check("workspaces_firm_context_length", sql`char_length(${table.firmContext}) <= 4000`),
    index("workspaces_created_by_idx").on(table.createdBy),
  ],
).enableRLS();

export const workspaceAuditEvents = pgTable(
  "workspace_audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id"),
    actorEmail: text("actor_email").notNull(),
    eventType: text("event_type").notNull(),
    changedFields: text("changed_fields")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    metadata: jsonb("metadata")
      .$type<Record<string, string>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "workspace_audit_events_type_check",
      sql`${table.eventType} in ('workspace.profile_updated', 'workspace.context_updated')`,
    ),
    check(
      "workspace_audit_events_actor_email_length",
      sql`char_length(${table.actorEmail}) between 3 and 254`,
    ),
    index("workspace_audit_events_workspace_occurred_idx").on(
      table.workspaceId,
      table.occurredAt.desc(),
    ),
  ],
).enableRLS();

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id").notNull(),
    userId: uuid("user_id").notNull(),
    email: text("email").notNull(),
    role: text("role", { enum: ["owner", "admin", "attorney", "paralegal", "member"] })
      .notNull()
      .default("owner"),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.userId] }),
    check("workspace_members_email_normalized", sql`${table.email} = lower(btrim(${table.email}))`),
    check("workspace_members_email_length", sql`char_length(${table.email}) between 3 and 254`),
    check(
      "workspace_members_role_check",
      sql`${table.role} in ('owner', 'admin', 'attorney', 'paralegal', 'member')`,
    ),
    index("workspace_members_user_id_idx").on(table.userId),
    index("workspace_members_email_idx").on(table.email),
  ],
).enableRLS();

export const matterStatuses = [
  "intake",
  "parsing",
  "conflict_flagged",
  "ready_for_export",
] as const;
export type MatterStatus = (typeof matterStatuses)[number];

export const importBatchStatuses = ["pending", "completed"] as const;
export type ImportBatchStatus = (typeof importBatchStatuses)[number];

export const importRowActions = ["create", "skip", "invalid"] as const;
export type ImportRowAction = (typeof importRowActions)[number];

export const importBatches = pgTable(
  "import_batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull(),
    status: text("status", { enum: importBatchStatuses }).notNull().default("pending"),
    totalRows: integer("total_rows").notNull(),
    result: jsonb("result").$type<{ count: number; matterIds: string[] } | null>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    check("import_batches_total_rows_check", sql`${table.totalRows} between 1 and 500`),
    check("import_batches_status_check", sql`${table.status} in ('pending', 'completed')`),
    index("import_batches_workspace_expiry_idx").on(table.workspaceId, table.expiresAt),
    pgPolicy("Workspace importers can read import batches", {
      for: "select",
      to: ["authenticated"],
      using: sql`exists (
        select 1 from public.workspace_members as member
        where member.workspace_id = ${table.workspaceId}
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      ) and ${table.status} = 'pending' and ${table.expiresAt} > now()`,
    }),
    pgPolicy("Workspace importers can create import batches", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`${table.createdBy} = (select auth.uid())
        and ${table.status} = 'pending'
        and exists (
          select 1 from public.workspace_members as member
          where member.workspace_id = ${table.workspaceId}
            and member.user_id = (select auth.uid())
            and member.role in ('owner', 'admin', 'attorney')
        )`,
    }),
    pgPolicy("Workspace importers can update import batches", {
      for: "update",
      to: ["authenticated"],
      using: sql`exists (
        select 1 from public.workspace_members as member
        where member.workspace_id = ${table.workspaceId}
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
      withCheck: sql`exists (
        select 1 from public.workspace_members as member
        where member.workspace_id = ${table.workspaceId}
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
    }),
  ],
).enableRLS();

export const importBatchRows = pgTable(
  "import_batch_rows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    batchId: uuid("batch_id")
      .notNull()
      .references(() => importBatches.id, { onDelete: "cascade" }),
    rowNumber: integer("row_number").notNull(),
    rawData: jsonb("raw_data").$type<Record<string, string>>().notNull(),
    errors: text("errors")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    isDuplicate: boolean("is_duplicate").notNull().default(false),
    action: text("action", { enum: importRowActions }).notNull(),
  },
  (table) => [
    uniqueIndex("import_batch_rows_batch_row_unique_idx").on(table.batchId, table.rowNumber),
    index("import_batch_rows_batch_idx").on(table.batchId),
    check("import_batch_rows_row_number_check", sql`${table.rowNumber} between 2 and 501`),
    check("import_batch_rows_action_check", sql`${table.action} in ('create', 'skip', 'invalid')`),
    check(
      "import_batch_rows_validation_state_check",
      sql`(cardinality(${table.errors}) > 0 and ${table.action} = 'invalid')
        or (cardinality(${table.errors}) = 0 and ${table.action} in ('create', 'skip'))`,
    ),
    pgPolicy("Workspace importers can read staged rows", {
      for: "select",
      to: ["authenticated"],
      using: sql`exists (
        select 1 from public.import_batches as batch
        join public.workspace_members as member on member.workspace_id = batch.workspace_id
        where batch.id = ${table.batchId}
          and batch.status = 'pending'
          and batch.expires_at > now()
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
    }),
    pgPolicy("Workspace importers can create staged rows", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`exists (
        select 1 from public.import_batches as batch
        join public.workspace_members as member on member.workspace_id = batch.workspace_id
        where batch.id = ${table.batchId}
          and batch.status = 'pending'
          and batch.expires_at > now()
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
    }),
    pgPolicy("Workspace importers can update staged rows", {
      for: "update",
      to: ["authenticated"],
      using: sql`exists (
        select 1 from public.import_batches as batch
        join public.workspace_members as member on member.workspace_id = batch.workspace_id
        where batch.id = ${table.batchId}
          and batch.status = 'pending'
          and batch.expires_at > now()
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
      withCheck: sql`exists (
        select 1 from public.import_batches as batch
        join public.workspace_members as member on member.workspace_id = batch.workspace_id
        where batch.id = ${table.batchId}
          and batch.status = 'pending'
          and batch.expires_at > now()
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
    }),
  ],
).enableRLS();

export const matters = pgTable(
  "matters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    petitionType: text("petition_type").notNull(),
    sponsorEmployer: text("sponsor_employer").notNull().default(""),
    fieldOfEndeavor: text("field_of_endeavor").notNull().default(""),
    status: text("status", { enum: matterStatuses }).notNull().default("intake"),
    assignedAttorneyUserId: uuid("assigned_attorney_user_id"),
    importBatchRowId: uuid("import_batch_row_id"),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "matters_import_batch_row_fk",
      columns: [table.importBatchRowId],
      foreignColumns: [importBatchRows.id],
    }).onDelete("set null"),
    uniqueIndex("matters_import_batch_row_unique_idx").on(table.importBatchRowId),
    index("matters_workspace_updated_idx").on(table.workspaceId, table.updatedAt.desc()),
    index("matters_workspace_status_idx").on(table.workspaceId, table.status),
    check(
      "matters_first_name_length",
      sql`char_length(btrim(${table.firstName})) between 1 and 100`,
    ),
    check("matters_last_name_length", sql`char_length(btrim(${table.lastName})) between 1 and 100`),
    check("matters_email_normalized", sql`${table.email} = lower(btrim(${table.email}))`),
    check("matters_email_length", sql`char_length(${table.email}) between 3 and 254`),
    check(
      "matters_petition_type_length",
      sql`char_length(btrim(${table.petitionType})) between 1 and 40`,
    ),
    check("matters_sponsor_employer_length", sql`char_length(${table.sponsorEmployer}) <= 160`),
    check("matters_field_of_endeavor_length", sql`char_length(${table.fieldOfEndeavor}) <= 240`),
    check(
      "matters_status_check",
      sql`${table.status} in ('intake', 'parsing', 'conflict_flagged', 'ready_for_export')`,
    ),
    pgPolicy("Workspace staff can read matters", {
      for: "select",
      to: ["authenticated"],
      using: sql`exists (
        select 1 from public.workspace_members as member
        where member.workspace_id = ${table.workspaceId}
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney', 'paralegal')
      )`,
    }),
    pgPolicy("Workspace attorneys can create matters", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`${table.status} = 'intake'
        and ${table.assignedAttorneyUserId} is null
        and ${table.createdBy} = (select auth.uid())
        and exists (
        select 1 from public.workspace_members as member
        where member.workspace_id = ${table.workspaceId}
          and member.user_id = (select auth.uid())
          and member.role in ('owner', 'admin', 'attorney')
      )`,
    }),
  ],
).enableRLS();
