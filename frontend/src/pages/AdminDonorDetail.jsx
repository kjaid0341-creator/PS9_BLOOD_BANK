import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';

const AdminDonorDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const response = await api.get(`/donors/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load donor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading donor record...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>{error}</div>;
  if (!data) return null;

  const { donor, eligibility, donations } = data;

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '1rem' }}>
      <Link to="/admin/donors" style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Donor Directory
      </Link>

      <div style={{
        padding: '1.2rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        backgroundColor: eligibility.isEligible ? '#ecfdf5' : '#fef2f2',
        border: `1px solid ${eligibility.isEligible ? '#10b981' : '#ef4444'}`
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: eligibility.isEligible ? '#065f46' : '#991b1b' }}>
          Eligibility Status: {eligibility.isEligible ? 'Eligible for Donation' : 'Not Eligible'}
        </h3>
        {!eligibility.isEligible && (
          <ul style={{ margin: '0.4rem 0', paddingLeft: '1.2rem', color: '#7f1d1d' }}>
            {eligibility.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Donor Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><strong>Name:</strong> {donor.name}</div>
          <div><strong>Blood Group:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{donor.bloodGroup}</span></div>
          <div><strong>Email:</strong> {donor.email}</div>
          <div><strong>Phone:</strong> {donor.phone}</div>
          <div><strong>City:</strong> {donor.city}</div>
          <div><strong>Age:</strong> {eligibility.age} years ({new Date(donor.dob).toLocaleDateString()})</div>
          <div><strong>Last Donated:</strong> {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Past Donations Record</h3>
        {donations.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No donation records found for this donor.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.6rem 0.8rem' }}>Date</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Blood Group</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Units</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem 0.8rem' }}>{new Date(d.donationDate).toLocaleDateString()}</td>
                  <td style={{ padding: '0.6rem 0.8rem', fontWeight: 'bold' }}>{d.bloodGroup}</td>
                  <td style={{ padding: '0.6rem 0.8rem' }}>{d.units} Unit(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDonorDetail;
