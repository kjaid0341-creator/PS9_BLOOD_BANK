import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#ef4444' }}>404</h1>
      <h2 style={{ color: '#1f2937' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', maxWidth: '400px', margin: '1rem auto' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#ef4444',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: '600'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
