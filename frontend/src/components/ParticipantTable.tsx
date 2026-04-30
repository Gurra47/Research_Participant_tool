'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Participant = {
  id: string;
  name: string;
  email: string;
  status: string | null;
  booking_time: string | null;
  credits_awarded: number | null;
};

interface ParticipantTableProps {
  participants: Participant[];
  studyCredits: number;
}

const statuses = ['Enrolled', 'Scheduled', 'Completed', 'Cancelled', 'No-show'];

function formatBookingTime(value: string | null) {
  if (!value) {
    return 'Not booked';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function ParticipantTable({ participants, studyCredits }: ParticipantTableProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const updateParticipant = async (
    participantId: string,
    updates: { status?: string; credits_awarded?: number }
  ) => {
    setBusyId(participantId);
    const { error } = await supabase
      .from('participants')
      .update(updates)
      .eq('id', participantId);

    setBusyId(null);

    if (error) {
      alert('Could not update participant.');
      return;
    }

    router.refresh();
  };

  const removeParticipant = async (participantId: string) => {
    const shouldDelete = window.confirm('Remove this participant from the study?');

    if (!shouldDelete) {
      return;
    }

    setBusyId(participantId);
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    setBusyId(null);

    if (error) {
      alert('Could not remove participant.');
      return;
    }

    router.refresh();
  };

  if (participants.length === 0) {
    return <p className="empty-text">No participants enrolled yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Booking</th>
            <th>Status</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            const isBusy = busyId === participant.id;
            const status = participant.status || 'Enrolled';

            return (
              <tr key={participant.id}>
                <td>
                  <strong>{participant.name}</strong>
                  <span>{participant.email}</span>
                </td>
                <td>{formatBookingTime(participant.booking_time)}</td>
                <td>
                  <select
                    value={status}
                    disabled={isBusy}
                    onChange={(event) => {
                      const nextStatus = event.target.value;
                      updateParticipant(participant.id, {
                        status: nextStatus,
                        credits_awarded:
                          nextStatus === 'Completed' ? studyCredits : participant.credits_awarded || 0,
                      });
                    }}
                  >
                    {statuses.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{participant.credits_awarded || 0}</td>
                <td>
                  <button
                    className="text-button"
                    type="button"
                    disabled={isBusy}
                    onClick={() => removeParticipant(participant.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
