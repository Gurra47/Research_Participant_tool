'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StudyCard from '@/components/StudyCard';

type Study = {
  id: string;
  title: string;
  description?: string | null;
  researcher_name?: string | null;
  researcher_email?: string | null;
  status?: string | null;
  created_at: string;
  credits?: number | null;
  capacity?: number | null;
  duration_minutes?: number | null;
};

interface StudyFeedProps {
  studies: Study[];
}

const storageKey = 'researchhub.viewerEmail';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export default function StudyFeed({ studies }: StudyFeedProps) {
  const [viewerEmail, setViewerEmail] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(storageKey) || '';
  });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const email = normalizeEmail(viewerEmail);

    if (!email) {
      return;
    }

    let isActive = true;

    async function loadScores() {
      setIsLoading(true);
      window.localStorage.setItem(storageKey, email);

      const { data: yourStudies } = await supabase
        .from('studies')
        .select('id')
        .eq('researcher_email', email);

      const studyIds = yourStudies?.map((study) => study.id) || [];

      if (studyIds.length === 0) {
        if (isActive) {
          setScores({});
          setIsLoading(false);
        }
        return;
      }

      const ownerEmails = Array.from(
        new Set(
          studies
            .map((study) => normalizeEmail(study.researcher_email || ''))
            .filter(Boolean)
            .filter((ownerEmail) => ownerEmail !== email)
        )
      );

      if (ownerEmails.length === 0) {
        if (isActive) {
          setScores({});
          setIsLoading(false);
        }
        return;
      }

      const { data: reciprocalParticipants } = await supabase
        .from('participants')
        .select('email, credits_awarded')
        .in('study_id', studyIds)
        .in('email', ownerEmails)
        .eq('status', 'Completed');

      if (!isActive) {
        return;
      }

      const nextScores = (reciprocalParticipants || []).reduce<Record<string, number>>(
        (totals, participant) => {
          const participantEmail = normalizeEmail(participant.email);
          totals[participantEmail] = (totals[participantEmail] || 0) + Math.max(participant.credits_awarded || 1, 1);
          return totals;
        },
        {}
      );

      setScores(nextScores);
      setIsLoading(false);
    }

    loadScores();

    return () => {
      isActive = false;
    };
  }, [studies, viewerEmail]);

  const sortedStudies = useMemo(() => {
    const activeScores = normalizeEmail(viewerEmail) ? scores : {};

    return [...studies].sort((first, second) => {
      const firstScore = activeScores[normalizeEmail(first.researcher_email || '')] || 0;
      const secondScore = activeScores[normalizeEmail(second.researcher_email || '')] || 0;

      if (firstScore !== secondScore) {
        return secondScore - firstScore;
      }

      return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
    });
  }, [scores, studies, viewerEmail]);

  return (
    <>
      <div className="feed-controls">
        <div className="form-group compact-input">
          <label htmlFor="feedViewerEmail">Your University Email</label>
          <input
            id="feedViewerEmail"
            type="email"
            value={viewerEmail}
            onChange={(event) => setViewerEmail(event.target.value)}
            placeholder="you@university.edu"
          />
        </div>
        <div className="feed-actions">
          <p className="helper-text">
            {isLoading ? 'Ranking studies...' : 'Studies from people who have helped you are shown first.'}
          </p>
          {normalizeEmail(viewerEmail) ? (
            <a className="btn btn-secondary" href={`/student/${encodeURIComponent(normalizeEmail(viewerEmail))}`}>
              Open My Student Page
            </a>
          ) : null}
        </div>
      </div>

      <div className="studies-grid">
        {sortedStudies.map((study) => {
          const score = normalizeEmail(viewerEmail)
            ? scores[normalizeEmail(study.researcher_email || '')] || 0
            : 0;

          return (
            <StudyCard
              key={study.id}
              study={study}
              helpScore={score}
            />
          );
        })}
      </div>
    </>
  );
}
