ALTER TABLE public.bookings ADD COLUMN pickup_time text DEFAULT '10:00';
ALTER TABLE public.bookings ADD COLUMN return_time text DEFAULT '10:00';