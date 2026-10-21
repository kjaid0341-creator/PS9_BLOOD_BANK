import { useState, useEffect } from 'react';
import api from '../api/axiosClient';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get('/donations/my');
        setDonations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your donation records');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading donations...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>My Donation History</h2>

      {donations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No donation records found.</p>
          <small>Once an administrator records a donation for your account, it will appear here.</small>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Date</th>
                <th style={{ padding: '0.8rem 1rem' }}>Blood Group</th>
                <th style={{ padding: '0.8rem 1rem' }}>Units Donated</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.8rem 1rem' }}>{new Date(d.donationDate).toLocaleDateString()}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 'bold', color: '#dc2626' }}>{d.bloodGroup}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{d.units} Unit(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
