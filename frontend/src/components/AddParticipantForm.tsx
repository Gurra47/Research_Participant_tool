'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AddParticipantFormProps {
  studyId: string;
  slots: {
    id: string;
    starts_at: string;
    capacity: number;
    location: string | null;
  }[];
  bookedCounts: Record<string, number>;
}

function formatSlotTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AddParticipantForm({ studyId, slots, bookedCounts }: AddParticipantFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timeslotId, setTimeslotId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSlot = slots.find((slot) => slot.id === timeslotId);

    if (!selectedSlot) {
      alert('Choose a time slot.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('participants')
      .insert([
        {
          study_id: studyId,
          timeslot_id: selectedSlot.id,
          name,
          email: email.toLowerCase().trim(),
          booking_time: selectedSlot.starts_at,
          status: 'Scheduled',
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error adding participant:', error);
      alert('Failed to add participant.');
    } else {
      setName('');
      setEmail('');
      setTimeslotId('');
      router.refresh();
    }
  };

  const availableSlots = slots.filter((slot) => (bookedCounts[slot.id] || 0) < slot.capacity);

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h3>Book a Time Slot</h3>

      {availableSlots.length === 0 ? (
        <p className="empty-text">No available time slots yet.</p>
      ) : null}
      
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
          <label htmlFor="timeslot">Time Slot</label>
          <select
            id="timeslot"
            value={timeslotId}
            onChange={(e) => setTimeslotId(e.target.value)}
            required
            disabled={availableSlots.length === 0}
          >
            <option value="">Choose a slot</option>
            {availableSlots.map((slot) => {
              const remaining = slot.capacity - (bookedCounts[slot.id] || 0);

              return (
                <option key={slot.id} value={slot.id}>
                  {formatSlotTime(slot.starts_at)} · {remaining} seats left
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting || availableSlots.length === 0}>
        {isSubmitting ? 'Booking...' : 'Book Slot'}
      </button>
    </form>
  );
}
