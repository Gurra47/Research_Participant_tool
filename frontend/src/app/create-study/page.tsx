'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateStudyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('studies')
      .insert([
        { title, description }
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
        <p>Fill out the details below to start a new research study.</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="study-form">
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

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Study'}
            </button>
            <a href="/dashboard" className="btn" style={{ marginLeft: '10px' }}>Cancel</a>
          </div>
        </form>
      </main>
    </div>
  );
}
