ALTER TABLE "oauth_accounts" RENAME COLUMN "providerUserId" TO "provider_user_id";--> statement-breakpoint
ALTER TABLE "oauth_accounts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "base_songs" RENAME COLUMN "clubId" TO "club_id";--> statement-breakpoint
ALTER TABLE "base_songs" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "base_songs" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "clubs" RENAME COLUMN "displayName" TO "display_name";--> statement-breakpoint
ALTER TABLE "clubs" RENAME COLUMN "heardleDay" TO "heardle_day";--> statement-breakpoint
ALTER TABLE "clubs" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "clubs" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "gamesPlayed" TO "games_played";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "gamesWon" TO "games_won";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "currentStreak" TO "current_streak";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "maxStreak" TO "max_streak";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "clubId" TO "club_id";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users_to_clubs" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "users_to_clubs" RENAME COLUMN "clubId" TO "club_id";--> statement-breakpoint
ALTER TABLE "users_to_clubs" DROP CONSTRAINT "users_to_clubs_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_clubs" DROP CONSTRAINT "users_to_clubs_clubId_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_clubs" DROP CONSTRAINT "users_to_clubs_userId_clubId_pk";--> statement-breakpoint
ALTER TABLE "users_to_clubs" ADD CONSTRAINT "users_to_clubs_user_id_club_id_pk" PRIMARY KEY("user_id","club_id");--> statement-breakpoint
ALTER TABLE "users_to_clubs" ADD CONSTRAINT "users_to_clubs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_clubs" ADD CONSTRAINT "users_to_clubs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;