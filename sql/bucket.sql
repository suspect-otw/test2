-- IMPORTANT: First Create storage bucket for campaign images
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign_images', 'campaign_images', true);

-- Second Create campaign_images table to track images with campaign foreign keys
CREATE TABLE "public"."campaign_images" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "campaign_id" UUID NOT NULL REFERENCES "public"."campaigns"("id") ON DELETE CASCADE,
  "file_name" TEXT NOT NULL,
  "file_path" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "content_type" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
