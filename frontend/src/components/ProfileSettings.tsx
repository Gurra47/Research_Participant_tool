'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type StudentProfile = {
  email: string;
  display_name: string | null;
  university: string | null;
  programme: string | null;
  study_year: string | null;
  bio: string | null;
};

interface ProfileSettingsProps {
  email: string;
  profile: StudentProfile | null;
}

export default function ProfileSettings({ email, profile }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [university, setUniversity] = useState(profile?.university || '');
  const [programme, setProgramme] = useState(profile?.programme || '');
  const [studyYear, setStudyYear] = useState(profile?.study_year || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('student_profiles')
      .upsert(
        {
          email,
          display_name: displayName || null,
          university: university || null,
          programme: programme || null,
          study_year: studyYear || null,
          bio: bio || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    setIsSubmitting(false);

    if (error) {
      alert('Could not save profile settings.');
      return;
    }

    router.refresh();
  };

  return (
    <form className="panel profile-settings" onSubmit={saveProfile}>
      <div className="section-heading">
        <div>
          <h2>Profile Settings</h2>
          <p>Tell others who you are and what programme you study.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="university">University</label>
          <input
            id="university"
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
            placeholder="University of Gothenburg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="programme">Programme</label>
          <input
            id="programme"
            value={programme}
            onChange={(event) => setProgramme(event.target.value)}
            placeholder="Cognitive Science, Psychology, HCI..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="studyYear">Year / Term</label>
          <input
            id="studyYear"
            value={studyYear}
            onChange={(event) => setStudyYear(event.target.value)}
            placeholder="Year 2, MSc semester 1..."
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={3}
          placeholder="Short intro for other students."
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
