CREATE TABLE `faq_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faqId` varchar(100) NOT NULL,
	`faqQuestionEn` text,
	`faqQuestionZh` text,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100) NOT NULL,
	`totalViews` int NOT NULL DEFAULT 0,
	`viewsToday` int NOT NULL DEFAULT 0,
	`viewsThisWeek` int NOT NULL DEFAULT 0,
	`viewsThisMonth` int NOT NULL DEFAULT 0,
	`lastViewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faq_analytics_id` PRIMARY KEY(`id`),
	CONSTRAINT `faq_analytics_faqId_unique` UNIQUE(`faqId`)
);
--> statement-breakpoint
CREATE TABLE `faq_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faqId` varchar(100) NOT NULL,
	`faqQuestionEn` text,
	`faqQuestionZh` text,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100) NOT NULL,
	`userEmail` varchar(320),
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faq_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`totalFeedbacks` int NOT NULL DEFAULT 0,
	`feedbacksToday` int NOT NULL DEFAULT 0,
	`feedbacksThisWeek` int NOT NULL DEFAULT 0,
	`feedbacksThisMonth` int NOT NULL DEFAULT 0,
	`pendingFeedbacks` int NOT NULL DEFAULT 0,
	`resolvedFeedbacks` int NOT NULL DEFAULT 0,
	`autoReplySuccessRate` int NOT NULL DEFAULT 0,
	`averageResponseTime` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedback_analytics_id` PRIMARY KEY(`id`)
);
