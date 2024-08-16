ALTER TABLE "comment" ALTER COLUMN "name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "status" text DEFAULT 'new';