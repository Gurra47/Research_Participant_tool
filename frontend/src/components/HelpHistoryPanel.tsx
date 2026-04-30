'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HelpHistoryPanelProps {
  studyOwnerName: string | null;
  studyOwnerEmail: string | null;
}

type HelpHistoryState = {
  completedForYou: number;
  yourStudiesCount: number;
  loading: boolean;
  error: string | null;
};

const storageKey = 'researchhub.viewerEmail';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export default function HelpHistoryPanel({ studyOwnerName, studyOwnerEmail }: HelpHistoryPanelProps) {
  const [viewerEmail, setViewerEmail] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(storageKey) || '';
  });
  const [state, setState] = useState<HelpHistoryState>({
    completedForYou: 0,
    yourStudiesCount: 0,
    loading: false,
    error: null,
  });

  const ownerEmail = useMemo(() => normalizeEmail(studyOwnerEmail || ''), [studyOwnerEmail]);
  const ownerLabel = studyOwnerName || studyOwnerEmail || 'This researcher';

  useEffect(() => {
    const email = normalizeEmail(viewerEmail);

    if (!email || !ownerEmail || email === ownerEmail) {
      return;
    }

    let isActive = true;

    async function loadHelpHistory() {
      setState((current) => ({ ...current, loading: true, error: null }));
      window.localStorage.setItem(storageKey, email);

      const { data: yourStudies, error: studiesError } = await supabase
        .from('studies')
        .select('id')
        .eq('researcher_email', email);

      if (!isActive) {
        return;
      }

      if (studiesError) {
        setState({
          completedForYou: 0,
          yourStudiesCount: 0,
          loading: false,
          error: 'Could not load your studies.',
        });
        return;
      }

      const studyIds = yourStudies?.map((study) => study.id) || [];

      if (studyIds.length === 0) {
        setState({
          completedForYou: 0,
          yourStudiesCount: 0,
          loading: false,
          error: null,
        });
        return;
      }

      const { count, error: participantError } = await supabase
        .from('participants')
        .select('id', { count: 'exact', head: true })
        .in('study_id', studyIds)
        .eq('email', ownerEmail)
        .eq('status', 'Completed');

      if (!isActive) {
        return;
      }

      if (participantError) {
        setState({
          completedForYou: 0,
          yourStudiesCount: studyIds.length,
          loading: false,
          error: 'Could not load help history.',
        });
        return;
      }

      setState({
        completedForYou: count || 0,
        yourStudiesCount: studyIds.length,
        loading: false,
        error: null,
      });
    }

    loadHelpHistory();

    return () => {
      isActive = false;
    };
  }, [ownerEmail, viewerEmail]);

  const isOwnStudy = normalizeEmail(viewerEmail) && normalizeEmail(viewerEmail) === ownerEmail;

  return (
    <section className="panel help-history-panel">
      <div className="section-heading">
        <div>
          <h2>Help History</h2>
          <p>See whether this researcher has already completed your studies.</p>
        </div>
      </div>

      <div className="form-group compact-input">
        <label htmlFor="viewerEmail">Your University Email</label>
        <input
          type="email"
          id="viewerEmail"
          value={viewerEmail}
          onChange={(event) => setViewerEmail(event.target.value)}
          placeholder="you@university.edu"
        />
      </div>

      {ownerEmail ? (
        <div className="help-history-card">
          <span>{ownerLabel} has completed</span>
          <strong>{state.loading ? '...' : state.completedForYou}</strong>
          <span>of your studies</span>
        </div>
      ) : (
        <p className="empty-text">This study does not have a researcher email yet.</p>
      )}

      {isOwnStudy ? (
        <p className="helper-text">This is your own study, so help history is not shown here.</p>
      ) : null}

      {!isOwnStudy && viewerEmail && state.yourStudiesCount === 0 && !state.loading ? (
        <p className="helper-text">No studies found for your email yet.</p>
      ) : null}

      {state.error ? <p className="error-text">{state.error}</p> : null}
    </section>
  );
}
