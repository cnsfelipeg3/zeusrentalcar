
ALTER TABLE public.vehicles
ADD COLUMN purchase_price numeric DEFAULT 0,
ADD COLUMN initial_odometer integer DEFAULT 0,
ADD COLUMN current_odometer integer DEFAULT 0,
ADD COLUMN acquired_date date DEFAULT CURRENT_DATE,
ADD COLUMN license_plate text,
ADD COLUMN vin text,
ADD COLUMN color text,
ADD COLUMN notes text;
