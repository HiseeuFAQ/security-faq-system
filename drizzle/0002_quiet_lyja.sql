CREATE TABLE `auto_reply_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedbackId` int NOT NULL,
	`templateId` int NOT NULL,
	`userEmail` varchar(320) NOT NULL,
	`category` varchar(100) NOT NULL,
	`responseLanguage` varchar(10) NOT NULL,
	`status` enum('sent','failed','pending_review') NOT NULL DEFAULT 'pending_review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auto_reply_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auto_reply_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`keywords` text NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleZh` varchar(255) NOT NULL,
	`responseEn` text NOT NULL,
	`responseZh` text NOT NULL,
	`enabled` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auto_reply_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `auto_reply_templates_category_unique` UNIQUE(`category`)
);
