-- Storage policies for campaign_images bucket
-- These policies allow authenticated users to upload, view, update, and delete files in the campaign_images bucket

-- Create a policy to allow uploads to the campaign_images bucket
CREATE POLICY "Allow uploads to campaign_images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'campaign_images');

-- Create a policy to allow selecting objects from campaign_images bucket
CREATE POLICY "Allow select from campaign_images bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'campaign_images');

-- Create a policy to allow updating objects in campaign_images bucket
CREATE POLICY "Allow update to campaign_images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'campaign_images');

-- Create a policy to allow deleting objects from campaign_images bucket
CREATE POLICY "Allow delete from campaign_images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'campaign_images'); 