CREATE TABLE `faq_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faqId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`imageKey` varchar(255) NOT NULL,
	`altText` varchar(255),
	`caption` varchar(500),
	`displayOrder` int DEFAULT 0,
	`uploadedBy` int NOT NULL,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faq_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faqId` int NOT NULL,
	`version` int NOT NULL,
	`changeSummary` varchar(500),
	`questions` text NOT NULL,
	`answers` text NOT NULL,
	`status` enum('draft','published'),
	`changedBy` int NOT NULL,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faq_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`productType` varchar(50) NOT NULL,
	`scenario` varchar(50) NOT NULL,
	`questions` text NOT NULL,
	`answers` text NOT NULL,
	`featuredImageUrl` varchar(500),
	`seoTitle` varchar(255),
	`seoDescription` text,
	`tags` text,
	`version` int NOT NULL DEFAULT 1,
	`publishedAt` timestamp,
	`createdBy` int NOT NULL,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`),
	CONSTRAINT `faqs_slug_unique` UNIQUE(`slug`)
);
