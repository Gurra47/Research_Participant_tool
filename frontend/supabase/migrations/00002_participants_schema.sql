-- Create a table for participants
CREATE TABLE public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'Enrolled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Create policies (For development purposes, we allow open access. THIS MUST BE RESTRICTED LATER)
CREATE POLICY "Enable read access for all users" ON public.participants
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.participants
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.participants
    FOR DELETE USING (true);
