import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import StudyCard from '@/components/StudyCard';
import ProfileSettings from '@/components/ProfileSettings';

export const dynamic = 'force-dynamic';

type Study = {
  id: string;
  title: string;
  description: string | null;
  researcher_name: string | null;
  researcher_email: string | null;
  status: string | null;
  created_at: string;
  credits: number | null;
  capacity: number | null;
  duration_minutes: number | null;
};

type Participant = {
  id: string;
  study_id: string;
  name: string;
  email: string;
  status: string | null;
  credits_awarded: number | null;
};

type TimeSlot = {
  id: string;
  study_id: string;
  starts_at: string;
  capacity: number;
  location: string | null;
};

type StudentProfile = {
  email: string;
  display_name: string | null;
  university: string | null;
  programme: string | null;
  study_year: string | null;
  bio: string | null;
};

function normalizeEmail(email: string) {
  return decodeURIComponent(email).trim().toLowerCase();
}

function formatSlotTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function StudentPage({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const studentEmail = normalizeEmail(email);

  if (!studentEmail.includes('@')) {
    notFound();
  }

  const { data: ownedStudies } = await supabase
    .from('studies')
    .select('*')
    .eq('researcher_email', studentEmail)
    .order('created_at', { ascending: false });

  const { data: completedByStudent } = await supabase
    .from('participants')
    .select('*')
    .eq('email', studentEmail)
    .eq('status', 'Completed');

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('email', studentEmail)
    .maybeSingle();

  const studies = (ownedStudies || []) as Study[];
  const completed = (completedByStudent || []) as Participant[];
  const studentProfile = profile as StudentProfile | null;
  const studyIds = studies.map((study) => study.id);

  let participantsInOwnStudies: Participant[] = [];
  let slots: TimeSlot[] = [];

  if (studyIds.length > 0) {
    const [{ data: ownParticipants }, { data: ownSlots }] = await Promise.all([
      supabase
        .from('participants')
        .select('*')
        .in('study_id', studyIds)
        .eq('status', 'Completed'),
      supabase
        .from('timeslots')
        .select('*')
        .in('study_id', studyIds)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true }),
    ]);

    participantsInOwnStudies = (ownParticipants || []) as Participant[];
    slots = (ownSlots || []) as TimeSlot[];
  }

  const researcherName =
    studentProfile?.display_name ||
    studies.find((study) => study.researcher_name)?.researcher_name ||
    participantsInOwnStudies.find((participant) => participant.email === studentEmail)?.name ||
    studentEmail;

  const totalSeats = studies.reduce((total, study) => total + (study.capacity || 0), 0);
  const helpedOthers = completed.reduce(
    (total, participant) => total + Math.max(participant.credits_awarded || 1, 1),
    0
  );

  return (
    <div className="container">
      <header className="header profile-hero">
        <div>
          <h1>{researcherName}</h1>
          <p>{studentEmail}</p>
        </div>
        <div className="profile-badges">
          {studentProfile?.programme ? <span>{studentProfile.programme}</span> : null}
          {studentProfile?.study_year ? <span>{studentProfile.study_year}</span> : null}
          {studentProfile?.university ? <span>{studentProfile.university}</span> : null}
        </div>
      </header>

      <main className="main-content">
        <section className="profile-layout">
          <div className="panel profile-summary">
            <div className="section-heading">
              <div>
                <h2>About</h2>
                <p>Public context for collaboration between students.</p>
              </div>
            </div>

            <p className={studentProfile?.bio ? 'profile-copy' : 'empty-text'}>
              {studentProfile?.bio || 'No profile bio yet.'}
            </p>

            <div className="profile-facts">
              <div>
                <span>Programme</span>
                <strong>{studentProfile?.programme || 'Not set'}</strong>
              </div>
              <div>
                <span>Year / Term</span>
                <strong>{studentProfile?.study_year || 'Not set'}</strong>
              </div>
              <div>
                <span>University</span>
                <strong>{studentProfile?.university || 'Not set'}</strong>
              </div>
            </div>
          </div>

          <ProfileSettings email={studentEmail} profile={studentProfile} />
        </section>

        <section className="metrics-grid profile-metrics">
          <div className="metric">
            <span>Published Studies</span>
            <strong>{studies.length}</strong>
          </div>
          <div className="metric">
            <span>Total Seats</span>
            <strong>{totalSeats}</strong>
          </div>
          <div className="metric">
            <span>Helped Others</span>
            <strong>{helpedOthers}</strong>
          </div>
        </section>

        <section>
          <div className="panel">
            <div className="section-heading">
              <div>
                <h2>Open Time Slots</h2>
                <p>Upcoming sessions from this student&apos;s studies.</p>
              </div>
            </div>

            {slots.length > 0 ? (
              <div className="slot-list">
                {slots.slice(0, 6).map((slot) => {
                  const study = studies.find((item) => item.id === slot.study_id);

                  return (
                    <Link className="slot-card" key={slot.id} href={`/study/${slot.study_id}#time-slots`}>
                      <div>
                        <strong>{formatSlotTime(slot.starts_at)}</strong>
                        <span>{study?.title || 'Study'}</span>
                        <span>{slot.location || 'Location not set'}</span>
                      </div>
                      <div className="slot-meta">
                        <span>{slot.capacity} seats</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="empty-text">No upcoming time slots yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <h2>Studies</h2>
              <p>Studies published by this student.</p>
            </div>
          </div>

          {studies.length > 0 ? (
            <div className="studies-grid">
              {studies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          ) : (
            <div className="panel">
              <p className="empty-text">This student has not published any studies yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
