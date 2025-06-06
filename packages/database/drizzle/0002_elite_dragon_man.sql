CREATE TABLE "oauth_accounts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "oauth_accounts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"provider" varchar(10) NOT NULL,
	"providerUserId" varchar(100) NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "base_songs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "base_songs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"artist" varchar(50) NOT NULL,
	"album" varchar(100),
	"image" text,
	"audio" text NOT NULL,
	"clubId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users_to_clubs" (
	"userId" integer NOT NULL,
	"clubId" integer NOT NULL,
	CONSTRAINT "users_to_clubs_userId_clubId_pk" PRIMARY KEY("userId","clubId")
);
--> statement-breakpoint
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_name_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "statistics" ALTER COLUMN "clubId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "subdomain" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "displayName" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "heardleDay" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "gamesPlayed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "gamesWon" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "currentStreak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "maxStreak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "accuracy" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users_to_clubs" ADD CONSTRAINT "users_to_clubs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_clubs" ADD CONSTRAINT "users_to_clubs_clubId_clubs_id_fk" FOREIGN KEY ("clubId") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "statistics" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_subdomain_unique" UNIQUE("subdomain");