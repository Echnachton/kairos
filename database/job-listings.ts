import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobListingTable = sqliteTable("job_listings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingUrl: text("listing_url").notNull(),
  scanDate: int("scan_date", { mode: "timestamp" }),
});
