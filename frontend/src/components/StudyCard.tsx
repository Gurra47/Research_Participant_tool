import React from 'react';
import Link from 'next/link';
import styles from './StudyCard.module.css';

interface Study {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  created_at: string;
  credits?: number | null;
  capacity?: number | null;
  duration_minutes?: number | null;
}

interface StudyCardProps {
  study: Study;
}

export default function StudyCard({ study }: StudyCardProps) {
  const isActive = study.status === 'Active' || !study.status;

  return (
    <div className={styles.card}>
      <div className={styles.statusIndicator} data-active={isActive} />
      <h2 className={styles.title}>{study.title}</h2>
      <p className={styles.description}>
        {study.description || 'No description provided.'}
      </p>
      
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.status}>
            {study.status || 'Active'}
          </span>
          <span>{study.credits || 0} credits</span>
          <span>{study.duration_minutes || 0} min</span>
          {study.capacity ? <span>{study.capacity} seats</span> : null}
        </div>
        <Link href={`/study/${study.id}`} className="btn btn-secondary">
          View Details
        </Link>
      </div>
    </div>
  );
}
