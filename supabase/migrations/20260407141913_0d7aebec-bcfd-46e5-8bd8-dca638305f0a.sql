
CREATE POLICY "Anyone can update customer by id"
ON public.customers
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
