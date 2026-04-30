import React from 'react';
import { supabase } from '@/lib/supabase';
import StudyFeed from '@/components/StudyFeed';
import Link from 'next/link';

// Explicitly mark as dynamic since we are fetching from a database
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: studies, error } = await supabase
    .from('studies')
    .select('*')
    .order('created_at', { ascending: false });

  const activeStudies = studies?.filter((study) => (study.status || 'Active') === 'Active').length || 0;
  const totalCapacity = studies?.reduce((total, study) => total + (study.capacity || 0), 0) || 0;
  const researchersCount = new Set(
    studies
      ?.map((study) => study.researcher_email)
      .filter(Boolean)
  ).size;

  return (
    <div className="container">
      <main className="main-content">
        <header className="header animate-fade-in">
          <h1>Dashboard</h1>
          <p>Find studies and see who is already helping whom.</p>
        </header>

        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="dashboard-toolbar">
            <div className="metrics-grid compact">
              <div className="metric">
                <span>Active Studies</span>
                <strong>{activeStudies}</strong>
              </div>
              <div className="metric">
                <span>Total Capacity</span>
                <strong>{totalCapacity}</strong>
              </div>
              <div className="metric">
                <span>Researchers</span>
                <strong>{researchersCount}</strong>
              </div>
            </div>
            <Link href="/create-study" className="btn btn-primary">
              Create New Study
            </Link>
          </div>

          {error ? (
            <div className="form-container">
              <p style={{ color: 'red' }}>Error loading studies: {error.message}</p>
            </div>
          ) : studies && studies.length > 0 ? (
            <StudyFeed studies={studies} />
          ) : (
            <div className="form-container text-center">
              <h2>No active studies found.</h2>
              <p className="mt-4 mb-8" style={{ color: 'var(--text-muted)' }}>
                You have not created any studies yet. Create one to start recruiting participants.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
