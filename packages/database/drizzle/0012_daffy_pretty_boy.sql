ALTER TABLE "base_songs" ALTER COLUMN "artist" SET DATA TYPE varchar(50)[];--> statement-breakpoint
ALTER TABLE "base_songs" ADD COLUMN "track_id" text NOT NULL;