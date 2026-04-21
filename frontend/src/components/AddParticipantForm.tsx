'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AddParticipantFormProps {
  studyId: string;
}

export default function AddParticipantForm({ studyId }: AddParticipantFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('participants')
      .insert([
        { study_id: studyId, name, email }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error adding participant:', error);
      alert('Failed to add participant.');
    } else {
      setName('');
      setEmail('');
      // Refresh the current route to fetch the new participant list
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="participant-form" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Enroll New Participant</h3>
      
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Enrolling...' : 'Enroll Participant'}
      </button>
    </form>
  );
}
