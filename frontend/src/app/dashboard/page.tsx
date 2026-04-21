import React from 'react';
import { supabase } from '@/lib/supabase';

// Explicitly mark as dynamic since we are fetching from a database
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: studies, error } = await supabase
    .from('studies')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container">
      <header className="header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here are your active studies.</p>
      </header>

      <main className="main-content">
        <section className="studies-list">
          {error ? (
            <p>Error loading studies: {error.message}</p>
          ) : studies && studies.length > 0 ? (
            studies.map((study) => (
              <div key={study.id} className="study-card">
                <h2>{study.title}</h2>
                <p>Status: {study.status || 'Active'}</p>
                <a href={`/study/${study.id}`} className="btn">View Details</a>
              </div>
            ))
          ) : (
            <p>No active studies found.</p>
          )}
        </section>

        <div className="actions">
          <a href="/create-study" className="btn btn-primary">Create New Study</a>
        </div>
      </main>
    </div>
  );
}
