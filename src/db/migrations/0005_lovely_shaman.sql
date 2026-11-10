CREATE TABLE `routine_days` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`day_of_week` integer NOT NULL,
	`name` text,
	`is_rest_day` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_day_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`target_sets` integer DEFAULT 3 NOT NULL,
	`target_reps` integer DEFAULT 10 NOT NULL,
	`target_weight` real DEFAULT 0 NOT NULL,
	`rest_seconds` integer DEFAULT 60 NOT NULL,
	FOREIGN KEY (`routine_day_id`) REFERENCES `routine_days`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `exercises` ADD `is_custom` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `sets` ADD `target_weight` real;--> statement-breakpoint
ALTER TABLE `sets` ADD `target_reps` integer;--> statement-breakpoint
ALTER TABLE `workouts` ADD `routine_day_id` text;--> statement-breakpoint
ALTER TABLE `workouts` ADD `status` text DEFAULT 'completed' NOT NULL;