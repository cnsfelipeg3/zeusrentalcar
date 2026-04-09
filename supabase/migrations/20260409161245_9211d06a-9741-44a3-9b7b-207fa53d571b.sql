
-- Expense types
CREATE TYPE public.expense_type AS ENUM ('maintenance', 'insurance', 'fine', 'fuel', 'documentation', 'parts', 'cleaning', 'other');

-- Vehicle expenses table
CREATE TABLE public.vehicle_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type public.expense_type NOT NULL DEFAULT 'other',
  amount NUMERIC NOT NULL DEFAULT 0,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  supplier TEXT,
  is_recurring BOOLEAN DEFAULT false,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vehicle expenses"
ON public.vehicle_expenses
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_vehicle_expenses_updated_at
BEFORE UPDATE ON public.vehicle_expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Incident types
CREATE TYPE public.incident_type AS ENUM ('accident', 'breakdown', 'theft', 'vandalism', 'recall', 'other');
CREATE TYPE public.incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.incident_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Vehicle incidents table
CREATE TABLE public.vehicle_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  type public.incident_type NOT NULL DEFAULT 'other',
  severity public.incident_severity NOT NULL DEFAULT 'low',
  status public.incident_status NOT NULL DEFAULT 'open',
  title TEXT NOT NULL,
  description TEXT,
  incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_cost NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  photos JSON DEFAULT '[]'::json,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vehicle incidents"
ON public.vehicle_incidents
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_vehicle_incidents_updated_at
BEFORE UPDATE ON public.vehicle_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add more fields to vehicles for health tracking
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS engine_type TEXT,
ADD COLUMN IF NOT EXISTS engine_size TEXT,
ADD COLUMN IF NOT EXISTS doors INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS insurance_policy TEXT,
ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
ADD COLUMN IF NOT EXISTS registration_expiry DATE,
ADD COLUMN IF NOT EXISTS last_service_date DATE,
ADD COLUMN IF NOT EXISTS next_service_km INTEGER,
ADD COLUMN IF NOT EXISTS tire_condition TEXT DEFAULT 'good',
ADD COLUMN IF NOT EXISTS brake_condition TEXT DEFAULT 'good',
ADD COLUMN IF NOT EXISTS battery_condition TEXT DEFAULT 'good',
ADD COLUMN IF NOT EXISTS body_condition TEXT DEFAULT 'good';
