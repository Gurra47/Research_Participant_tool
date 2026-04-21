import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AddParticipantForm from '@/components/AddParticipantForm';

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

  return (
    <div className="container">
      <header className="header">
        <h1>{study.title}</h1>
        <p>Status: {study.status}</p>
      </header>

      <main className="main-content">
        <section className="study-info">
          <h2>Overview</h2>
          <p>{study.description || 'No description provided.'}</p>
          <p className="mt-4 text-sm">Created: {new Date(study.created_at).toLocaleDateString()}</p>
        </section>

        <section className="participants">
          <h2>Participants</h2>
          {participants && participants.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {participants.map((p) => (
                <li key={p.id} style={{ padding: '1rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{p.name}</strong> <span style={{ color: '#666' }}>({p.email})</span>
                  </div>
                  <div>
                    <span style={{ padding: '0.2rem 0.5rem', background: '#eee', borderRadius: '4px', fontSize: '0.8rem', color: '#333' }}>
                      {p.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No participants enrolled yet.</p>
          )}

          <AddParticipantForm studyId={study.id} />
        </section>

        <div className="actions" style={{ marginTop: '2rem' }}>
          <a href="/dashboard" className="btn">Back to Dashboard</a>
        </div>
      </main>
    </div>
  );
}
