-- Create campaigns table
CREATE TABLE "public"."campaigns" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "campaign_title" TEXT NOT NULL,
  "brand_name" TEXT NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "budget" NUMERIC NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
