CREATE TABLE `theme` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`styles` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX `user_username_unique`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `display_username`;