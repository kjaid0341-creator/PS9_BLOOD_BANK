import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/my');
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      Pending: { bg: '#fef3c7', text: '#92400e' },
      Approved: { bg: '#dbeafe', text: '#1e40af' },
      Fulfilled: { bg: '#d1fae5', text: '#065f46' },
      Rejected: { bg: '#fee2e2', text: '#991b1b' },
    };
    const c = colors[status] || { bg: '#f3f4f6', text: '#374151' };
    return (
      <span style={{ backgroundColor: c.bg, color: c.text, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
        {status}
      </span>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading requests...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#111827' }}>My Blood Requests</h2>
        <Link
          to="/requests/new"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          + Create Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>You have not submitted any blood requests yet.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Patient</th>
                <th style={{ padding: '0.8rem 1rem' }}>Group</th>
                <th style={{ padding: '0.8rem 1rem' }}>Units</th>
                <th style={{ padding: '0.8rem 1rem' }}>Hospital</th>
                <th style={{ padding: '0.8rem 1rem' }}>Required By</th>
                <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                <th style={{ padding: '0.8rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>{r.patientName}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 'bold', color: '#dc2626' }}>{r.bloodGroup}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{r.units}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{r.hospital}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{new Date(r.requiredByDate).toLocaleDateString()}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{getStatusBadge(r.status)}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    {r.status === 'Pending' ? (
                      <Link
                        to={`/my-requests/${r._id}/edit`}
                        style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'underline' }}
                      >
                        Edit
                      </Link>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
