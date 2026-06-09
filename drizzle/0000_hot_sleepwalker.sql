CREATE TABLE `preset_filters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`filter_string` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_modified_at` integer NOT NULL
);
