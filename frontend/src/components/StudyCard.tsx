import React from 'react';
import Link from 'next/link';
import styles from './StudyCard.module.css';

interface Study {
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
}

interface StudyCardProps {
  study: Study;
  helpScore?: number;
}

export default function StudyCard({ study, helpScore = 0 }: StudyCardProps) {
  const isActive = study.status === 'Active' || !study.status;
  const ownerHref = study.researcher_email
    ? `/student/${encodeURIComponent(study.researcher_email)}`
    : null;
  const ownerLabel = study.researcher_name || study.researcher_email || 'Unknown researcher';

  return (
    <div className={styles.card}>
      <div className={styles.statusIndicator} data-active={isActive} />
      <h2 className={styles.title}>{study.title}</h2>
      <p className={styles.owner}>
        By{' '}
        {ownerHref ? (
          <Link href={ownerHref}>{ownerLabel}</Link>
        ) : (
          ownerLabel
        )}
      </p>
      {helpScore > 0 ? (
        <div className={styles.helpBadge}>
          Has helped you {helpScore} time{helpScore === 1 ? '' : 's'}
        </div>
      ) : null}
      <p className={styles.description}>
        {study.description || 'No description provided.'}
      </p>
      
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.status}>
            {study.status || 'Active'}
          </span>
          <span>{study.credits || 0} help weight</span>
          <span>{study.duration_minutes || 0} min</span>
          {study.capacity ? <span>{study.capacity} seats</span> : null}
        </div>
        <Link href={`/study/${study.id}`} className="btn btn-secondary">
          View & Book
        </Link>
      </div>
      <Link href={`/study/${study.id}#time-slots`} className={styles.slotLink}>
        Create or manage time slots
      </Link>
    </div>
  );
}
