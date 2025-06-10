ALTER TABLE "users" ALTER COLUMN "display_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "secret_hash" text NOT NULL;