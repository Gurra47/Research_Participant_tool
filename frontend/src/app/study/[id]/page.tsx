import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AddParticipantForm from '@/components/AddParticipantForm';
import ParticipantTable from '@/components/ParticipantTable';
import Link from 'next/link';

export default async function StudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: study, error } = await supabase
    .from('studies')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !study) {
    notFound();
  }

  // Fetch participants for this study
  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('study_id', study.id)
    .order('created_at', { ascending: false });

  const participantList = participants || [];
  const capacity = study.capacity || 0;
  const studyCredits = study.credits || 0;
  const completedCount = participantList.filter((participant) => participant.status === 'Completed').length;
  const scheduledCount = participantList.filter((participant) => participant.booking_time).length;
  const creditsAwarded = participantList.reduce(
    (total, participant) => total + (participant.credits_awarded || 0),
    0
  );

  return (
    <div className="container">
      <header className="header">
        <h1>{study.title}</h1>
        <p>Status: {study.status || 'Active'}</p>
      </header>

      <main className="main-content">
        <section className="metrics-grid">
          <div className="metric">
            <span>Enrolled</span>
            <strong>{participantList.length}{capacity ? `/${capacity}` : ''}</strong>
          </div>
          <div className="metric">
            <span>Scheduled</span>
            <strong>{scheduledCount}</strong>
          </div>
          <div className="metric">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="metric">
            <span>Credits Awarded</span>
            <strong>{creditsAwarded}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Overview</h2>
              <p>{study.description || 'No description provided.'}</p>
            </div>
            <span className="badge">{studyCredits} credits</span>
          </div>

          <dl className="detail-list">
            <div>
              <dt>Location</dt>
              <dd>{study.location || 'Not set'}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{study.duration_minutes || 0} minutes</dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{capacity || 'Not set'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(study.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>

          {study.requirements ? (
            <div className="requirements">
              <h3>Eligibility Requirements</h3>
              <p>{study.requirements}</p>
            </div>
          ) : null}
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Participants</h2>
              <p>Manage bookings, completion status, and credits.</p>
            </div>
          </div>
          <ParticipantTable participants={participantList} studyCredits={studyCredits} />
          <AddParticipantForm studyId={study.id} />
        </section>

        <div className="actions">
          <Link href="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
