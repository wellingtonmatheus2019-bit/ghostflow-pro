ALTER TABLE `analytics` MODIFY COLUMN `engagementRate` decimal(5,2) NOT NULL DEFAULT '0';--> statement-breakpoint
ALTER TABLE `analytics` MODIFY COLUMN `conversionRate` decimal(5,2) NOT NULL DEFAULT '0';--> statement-breakpoint
ALTER TABLE `instagramAccounts` MODIFY COLUMN `engagement` decimal(5,2) NOT NULL DEFAULT '0';