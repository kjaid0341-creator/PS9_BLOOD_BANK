import { useState, useEffect } from 'react';
import api from '../api/axiosClient';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/donors/me');
        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile information...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>{error}</div>;
  if (!profileData) return <div style={{ textAlign: 'center', padding: '3rem' }}>No profile data found.</div>;

  const { user, eligibility, minGapDays } = profileData;

  return (
    <div style={{ maxWidth: '750px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        backgroundColor: eligibility.isEligible ? '#ecfdf5' : '#fef2f2',
        border: `1px solid ${eligibility.isEligible ? '#10b981' : '#ef4444'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{eligibility.isEligible ? '✅' : '⏳'}</span>
          <h3 style={{ margin: 0, color: eligibility.isEligible ? '#065f46' : '#991b1b' }}>
            {eligibility.isEligible ? 'You are Eligible to Donate Blood!' : 'Currently Not Eligible to Donate'}
          </h3>
        </div>

        {!eligibility.isEligible && (
          <div style={{ marginTop: '0.8rem', color: '#7f1d1d' }}>
            <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
              {eligibility.reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
            {eligibility.nextEligibleDate && (
              <p style={{ margin: 0, fontWeight: '600' }}>
                Next Eligible Donation Date: {new Date(eligibility.nextEligibleDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <small style={{ display: 'block', marginTop: '0.8rem', color: '#6b7280' }}>
          * Policy: Age must be 18–65 years. Minimum {minGapDays} days between successive donations.
        </small>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.06)' }}>
        <h2 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '0.8rem', marginTop: 0 }}>Donor Profile Details</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Full Name</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '600', fontSize: '1.1rem' }}>{user.name}</p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Blood Group</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '700', fontSize: '1.3rem', color: '#dc2626' }}>{user.bloodGroup}</p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Email</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>{user.email}</p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Phone</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>{user.phone}</p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>City</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>{user.city}</p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Date of Birth (Age)</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>
              {new Date(user.dob).toLocaleDateString()} ({eligibility.age} years old)
            </p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Last Recorded Donation</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>
              {user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'No donations recorded yet'}
            </p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Account Role</span>
            <p style={{ margin: '0.2rem 0', fontWeight: '600', textTransform: 'uppercase', color: '#4b5563' }}>{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
