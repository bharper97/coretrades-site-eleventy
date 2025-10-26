import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function JobDetail() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('id');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white',
      padding: '40px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        🎯 HELLO FROM JOB DETAIL PAGE 🎯
      </h1>
      
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        Job ID from URL: <strong>{jobId || 'NO ID PROVIDED'}</strong>
      </p>

      <p style={{ fontSize: '18px', color: '#f57c00', marginBottom: '40px' }}>
        If you can see this message, the JobDetail page routing is WORKING!
      </p>

      <Link 
        to="/job-board" 
        style={{
          display: 'inline-block',
          backgroundColor: '#f57c00',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        ← Back to Job Board
      </Link>
    </div>
  );
}