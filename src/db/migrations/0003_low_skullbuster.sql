CREATE TABLE `habit_resets` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`reset_at` integer NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`note` text,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT 'fire' NOT NULL,
	`color` text DEFAULT '#ef4444' NOT NULL,
	`start_at` integer NOT NULL,
	`best_ms` integer DEFAULT 0 NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`privacy_hidden` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `habits` (`id`, `name`, `icon`, `color`, `start_at`, `best_ms`, `archived`, `order_index`, `privacy_hidden`)
SELECT `id`, `label`, 'fire', '#ef4444', `start_date`, `best_duration_ms`, 0, 0, 0 FROM `streaks`;
--> statement-breakpoint
INSERT INTO `habit_resets` (`id`, `habit_id`, `reset_at`, `duration_ms`, `note`)
SELECT `id`, `streak_id`, `reset_at`, `duration_ms`, `note` FROM `streak_resets`;
--> statement-breakpoint
DROP TABLE `streak_resets`;--> statement-breakpoint
DROP TABLE `streaks`;