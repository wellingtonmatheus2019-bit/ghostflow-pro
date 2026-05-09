CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int,
	`automationId` int,
	`action` varchar(255) NOT NULL,
	`details` json,
	`riskLevel` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int NOT NULL,
	`date` timestamp NOT NULL,
	`followersGained` int NOT NULL DEFAULT 0,
	`followersLost` int NOT NULL DEFAULT 0,
	`engagementRate` decimal(5,2) NOT NULL DEFAULT 0,
	`actionsExecuted` int NOT NULL DEFAULT 0,
	`conversionRate` decimal(5,2) NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `apiKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`key` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastUsed` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apiKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `apiKeys_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `automations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('follow','unfollow','like','comment','story_view','story_reaction') NOT NULL,
	`targetFilters` json NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`dailyLimit` int NOT NULL,
	`delayMin` int NOT NULL,
	`delayMax` int NOT NULL,
	`humanBehavior` boolean NOT NULL DEFAULT true,
	`schedule` json,
	`actionsExecuted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instagramAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`instagramUsername` varchar(255) NOT NULL,
	`instagramId` varchar(255) NOT NULL,
	`accessToken` text NOT NULL,
	`followers` int NOT NULL DEFAULT 0,
	`engagement` decimal(5,2) NOT NULL DEFAULT 0,
	`status` enum('active','inactive','suspended','error') NOT NULL DEFAULT 'active',
	`lastSync` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instagramAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `instagramAccounts_instagramId_unique` UNIQUE(`instagramId`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`billingCycle` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
	`maxAccounts` int NOT NULL,
	`maxAutomations` int NOT NULL,
	`features` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`status` enum('active','cancelled','expired','pending') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp,
	`autoRenew` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
