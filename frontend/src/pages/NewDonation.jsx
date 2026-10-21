import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const NewDonation = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonorId, setSelectedDonorId] = useState('');
  const [units, setUnits] = useState(1);
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reasons, setReasons] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await api.get('/donors');
        setDonors(response.data);
        if (response.data.length > 0) {
          setSelectedDonorId(response.data[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch donors list');
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const selectedDonor = donors.find((d) => d._id === selectedDonorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setReasons([]);

    try {
      await api.post('/donations', {
        donorId: selectedDonorId,
        units: Number(units),
        donationDate,
      });
      navigate('/admin/stock');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record donation');
      if (err.response?.data?.reasons) {
        setReasons(err.response.data.reasons);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading donors...</div>;

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Record New Blood Donation</h2>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          <strong>{error}</strong>
          {reasons.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
              {reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Select Donor *</label>
          <select
            value={selectedDonorId}
            onChange={(e) => setSelectedDonorId(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            {donors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.bloodGroup}) - {d.eligibility.isEligible ? 'Eligible' : 'Ineligible'}
              </option>
            ))}
          </select>
        </div>

        {selectedDonor && (
          <div style={{
            padding: '0.8rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            backgroundColor: selectedDonor.eligibility.isEligible ? '#ecfdf5' : '#fef2f2',
            fontSize: '0.85rem'
          }}>
            <strong>Donor Status: </strong>
            {selectedDonor.eligibility.isEligible ? (
              <span style={{ color: '#065f46' }}>Eligible to donate</span>
            ) : (
              <span style={{ color: '#991b1b' }}>Ineligible ({selectedDonor.eligibility.reasons.join(', ')})</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Units Donated *</label>
          <input
            type="number"
            min="1"
            required
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Donation Date *</label>
          <input
            type="date"
            required
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Recording...' : 'Accept and Record Donation'}
        </button>
      </form>
    </div>
  );
};

export default NewDonation;
