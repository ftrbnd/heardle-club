ALTER TABLE "sessions" RENAME COLUMN "expires_at" TO "last_verified_at";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "secret_hash" SET DATA TYPE "undefined"."bytea";