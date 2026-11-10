CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`time` text,
	`done` integer DEFAULT false NOT NULL,
	`repeat_rule` text DEFAULT 'none' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `streak_resets` (
	`id` text PRIMARY KEY NOT NULL,
	`streak_id` text NOT NULL,
	`reset_at` integer NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`note` text,
	FOREIGN KEY (`streak_id`) REFERENCES `streaks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `streaks` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`start_date` integer NOT NULL,
	`best_duration_ms` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `body_weights` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`kg` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`weight` real NOT NULL,
	`reps` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`is_pr` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`name` text NOT NULL,
	`notes` text
);
