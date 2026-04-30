-- Store public student profile details for the reciprocity network.
CREATE TABLE IF NOT EXISTS public.student_profiles (
    email TEXT PRIMARY KEY,
    display_name TEXT,
    university TEXT,
    programme TEXT,
    study_year TEXT,
    bio TEXT,
    research_interests TEXT,
    availability_note TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.student_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.student_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.student_profiles
    FOR UPDATE USING (true);
