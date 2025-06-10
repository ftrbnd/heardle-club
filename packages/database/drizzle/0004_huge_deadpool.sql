ALTER TABLE "oauth_accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "base_songs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "base_songs" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "base_songs" ALTER COLUMN "club_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "clubs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "clubs" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "statistics" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "statistics" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "statistics" ALTER COLUMN "club_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_to_clubs" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_to_clubs" ALTER COLUMN "club_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");