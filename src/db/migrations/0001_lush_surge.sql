CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`is_default` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `category_id` text DEFAULT 'cat-general' NOT NULL REFERENCES categories(id);