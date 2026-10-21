import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const response = await api.get('/requests', { params });
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    setMessage('');
    setError('');

    let rejectionReason = '';
    if (status === 'Rejected') {
      rejectionReason = window.prompt('Enter reason for rejection:') || 'Not specified';
    }

    try {
      const res = await api.patch(`/requests/${id}/status`, { status, rejectionReason });
      setMessage(res.data.message);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Status transition failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading requests...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Manage Blood Requests</h2>

      {message && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#ecfdf5', color: '#065f46', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ fontWeight: '500' }}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No blood requests found for this filter.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Patient</th>
                <th style={{ padding: '0.8rem 1rem' }}>Requester</th>
                <th style={{ padding: '0.8rem 1rem' }}>Blood Group</th>
                <th style={{ padding: '0.8rem 1rem' }}>Units</th>
                <th style={{ padding: '0.8rem 1rem' }}>Hospital</th>
                <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                <th style={{ padding: '0.8rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>{r.patientName}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{r.requester?.name || 'N/A'} ({r.requester?.phone || ''})</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 'bold', color: '#dc2626' }}>{r.bloodGroup}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{r.units}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{r.hospital}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    {r.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(r._id, 'Approved')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(r._id, 'Fulfilled')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Fulfill
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(r._id, 'Rejected')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {r.status === 'Approved' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(r._id, 'Fulfilled')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Fulfill & Deduct Stock
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(r._id, 'Rejected')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {(r.status === 'Fulfilled' || r.status === 'Rejected') && (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Completed</span>
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

export default AdminRequests;
