-- Add bookable study time slots.
CREATE TABLE IF NOT EXISTS public.timeslots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INTEGER DEFAULT 1 NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timeslots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.timeslots
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.timeslots
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.timeslots
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.timeslots
    FOR DELETE USING (true);

ALTER TABLE public.participants
ADD COLUMN IF NOT EXISTS timeslot_id UUID REFERENCES public.timeslots(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS timeslots_study_id_idx
ON public.timeslots (study_id);

CREATE INDEX IF NOT EXISTS participants_timeslot_id_idx
ON public.participants (timeslot_id);
