CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userEmail` varchar(320) NOT NULL,
	`emailNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`feedbackSubmittedNotification` enum('true','false') NOT NULL DEFAULT 'true',
	`statusUpdateNotification` enum('true','false') NOT NULL DEFAULT 'true',
	`autoReplyNotification` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userEmail_unique` UNIQUE(`userEmail`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedbackId` int NOT NULL,
	`userEmail` varchar(320) NOT NULL,
	`type` enum('feedback_submitted','feedback_read','feedback_resolved','auto_reply_sent','status_updated') NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleZh` varchar(255) NOT NULL,
	`contentEn` text NOT NULL,
	`contentZh` text NOT NULL,
	`isRead` enum('true','false') NOT NULL DEFAULT 'false',
	`emailSent` enum('true','false') NOT NULL DEFAULT 'false',
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
