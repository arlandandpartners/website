
-- Allow authenticated users to submit their own property for review (pending status only)
CREATE POLICY "Authenticated users can submit properties for review"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (status = 'pending');
