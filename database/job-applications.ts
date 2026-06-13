import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { jobListingTable } from "./job-listings";

export const jobApplicationsTableStatusEnum = [
  "NEW",
  "APPLIED",
  "REJECTED",
  "OFFER_RECEIVED",
  "OFFER_ACCEPTED",
] as const;

export const jobApplicationsTable = sqliteTable("job_applications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: text("status", { enum: jobApplicationsTableStatusEnum }),
  jobListingId: text("job_listing_id")
    .references(() => jobListingTable.id)
    .notNull(),
});
