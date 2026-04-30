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
  const [bookingTime, setBookingTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('participants')
      .insert([
        {
          study_id: studyId,
          name,
          email,
          booking_time: bookingTime ? new Date(bookingTime).toISOString() : null,
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error adding participant:', error);
      alert('Failed to add participant.');
    } else {
      setName('');
      setEmail('');
      setBookingTime('');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h3>Enroll New Participant</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookingTime">Booking Time</label>
          <input
            type="datetime-local"
            id="bookingTime"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Enrolling...' : 'Enroll Participant'}
      </button>
    </form>
  );
}
