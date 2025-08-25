CREATE TYPE "public"."source" AS ENUM('file_upload', 'youtube_download');--> statement-breakpoint
ALTER TABLE "base_songs" ADD COLUMN "source" "source" NOT NULL;