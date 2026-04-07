
ALTER TABLE public.customers 
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS driver_license_file_url text;

-- Allow anonymous inserts for public registration form
CREATE POLICY "Anyone can register as customer"
ON public.customers
FOR INSERT
TO anon
WITH CHECK (true);
