
-- Vehicle inspections table for check-in/check-out
CREATE TABLE public.vehicle_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout')),
  odometer_reading INTEGER,
  fuel_level TEXT DEFAULT 'full',
  exterior_photos JSONB DEFAULT '[]'::jsonb,
  damages JSONB DEFAULT '[]'::jsonb,
  accessories_check JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  customer_signature TEXT,
  agent_signature TEXT,
  agent_name TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id, type)
);

ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inspections"
  ON public.vehicle_inspections
  FOR ALL
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for inspection photos
INSERT INTO storage.buckets (id, name, public) VALUES ('inspections', 'inspections', true);

CREATE POLICY "Admins can upload inspection photos"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'inspections' AND has_role(auth.uid(), 'admin'::app_role));

-- Update trigger
CREATE TRIGGER update_vehicle_inspections_updated_at
  BEFORE UPDATE ON public.vehicle_inspections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
