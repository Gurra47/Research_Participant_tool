-- Create a table for studies
CREATE TABLE public.studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;

-- Create policies (For development purposes, we allow open access. THIS MUST BE RESTRICTED LATER)
CREATE POLICY "Enable read access for all users" ON public.studies
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.studies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.studies
    FOR UPDATE USING (true);
