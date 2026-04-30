'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateStudyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [researcherEmail, setResearcherEmail] = useState('');
  const [location, setLocation] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [credits, setCredits] = useState(1);
  const [capacity, setCapacity] = useState(20);
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('studies')
      .insert([
        {
          title,
          description,
          researcher_name: researcherName,
          researcher_email: researcherEmail.toLowerCase().trim(),
          location,
          duration_minutes: durationMinutes,
          credits,
          capacity,
          requirements,
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error inserting study:', error);
      alert('Failed to create study.');
    } else {
      alert('Study created successfully!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Create New Study</h1>
        <p>Publish your study and make it easy for other students to help.</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="form-container animate-fade-in">
          <div className="form-group">
            <label htmlFor="title">Study Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            ></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="researcherName">Your Name</label>
              <input
                type="text"
                id="researcherName"
                value={researcherName}
                onChange={(e) => setResearcherName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="researcherEmail">University Email</label>
              <input
                type="email"
                id="researcherEmail"
                value={researcherEmail}
                onChange={(e) => setResearcherEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lab, room, or video link"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Participant Capacity</label>
              <input
                type="number"
                id="capacity"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="credits">Help Weight</label>
              <input
                type="number"
                id="credits"
                min="0"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Eligibility Requirements</label>
            <textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={3}
              placeholder="Optional screening criteria or preparation notes"
            ></textarea>
          </div>

          <div className="flex-center mt-4" style={{ gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Study'}
            </button>
            <Link href="/dashboard" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
