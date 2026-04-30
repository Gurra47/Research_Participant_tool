'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type TimeSlot = {
  id: string;
  starts_at: string;
  capacity: number;
  location: string | null;
  notes: string | null;
};

interface TimeSlotManagerProps {
  studyId: string;
  defaultLocation: string | null;
  slots: TimeSlot[];
  bookedCounts: Record<string, number>;
}

function formatSlotTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function TimeSlotManager({
  studyId,
  defaultLocation,
  slots,
  bookedCounts,
}: TimeSlotManagerProps) {
  const [startsAt, setStartsAt] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [location, setLocation] = useState(defaultLocation || '');
  const [notes, setNotes] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('timeslots')
      .insert([
        {
          study_id: studyId,
          starts_at: new Date(startsAt).toISOString(),
          capacity,
          location: location || null,
          notes: notes || null,
        },
      ]);

    setIsSubmitting(false);

    if (error) {
      alert('Could not create time slot.');
      return;
    }

    setStartsAt('');
    setCapacity(1);
    setNotes('');
    router.refresh();
  };

  const removeSlot = async (slotId: string) => {
    const shouldDelete = window.confirm('Remove this time slot? Existing bookings will keep their time.');

    if (!shouldDelete) {
      return;
    }

    setBusyId(slotId);
    const { error } = await supabase
      .from('timeslots')
      .delete()
      .eq('id', slotId);

    setBusyId(null);

    if (error) {
      alert('Could not remove time slot.');
      return;
    }

    router.refresh();
  };

  return (
    <section className="panel" id="time-slots">
      <div className="section-heading">
        <div>
          <h2>Time Slots</h2>
          <p>Create bookable sessions for participants.</p>
        </div>
      </div>

      <form onSubmit={addSlot} className="inline-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slotStartsAt">Start Time</label>
            <input
              type="datetime-local"
              id="slotStartsAt"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slotCapacity">Seats</label>
            <input
              type="number"
              id="slotCapacity"
              min="1"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slotLocation">Location</label>
            <input
              type="text"
              id="slotLocation"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="slotNotes">Notes</label>
            <input
              type="text"
              id="slotNotes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Time Slot'}
        </button>
      </form>

      {slots.length > 0 ? (
        <div className="slot-list">
          {slots.map((slot) => {
            const booked = bookedCounts[slot.id] || 0;
            const remaining = Math.max(slot.capacity - booked, 0);

            return (
              <div className="slot-card" key={slot.id}>
                <div>
                  <strong>{formatSlotTime(slot.starts_at)}</strong>
                  <span>{slot.location || defaultLocation || 'Location not set'}</span>
                  {slot.notes ? <span>{slot.notes}</span> : null}
                </div>
                <div className="slot-meta">
                  <span>{remaining}/{slot.capacity} seats left</span>
                  <button
                    type="button"
                    className="text-button"
                    disabled={busyId === slot.id}
                    onClick={() => removeSlot(slot.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-text">No time slots created yet.</p>
      )}
    </section>
  );
}
