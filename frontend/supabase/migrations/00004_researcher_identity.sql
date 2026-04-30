-- Add the study owner's identity so reciprocity can be measured between students.
ALTER TABLE public.studies
ADD COLUMN IF NOT EXISTS researcher_name TEXT,
ADD COLUMN IF NOT EXISTS researcher_email TEXT;

CREATE INDEX IF NOT EXISTS studies_researcher_email_idx
ON public.studies (lower(researcher_email));

CREATE INDEX IF NOT EXISTS participants_email_idx
ON public.participants (lower(email));
