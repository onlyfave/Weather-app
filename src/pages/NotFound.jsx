import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-3xl font-bold text-[var(--accent)]">404</h1>
      <p className="text-3xl font-bold text-[var(--accent)]">Oops! The page you're looking for doesn't exist.</p>

    </div>
  );
}

export default NotFound;