CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram" text NOT NULL,
	"selected_services" jsonb NOT NULL,
	"total_value" integer NOT NULL,
	"message" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
