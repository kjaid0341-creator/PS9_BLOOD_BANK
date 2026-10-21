import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    units: 1,
    hospital: '',
    requiredByDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get(`/requests/${id}`);
        const data = response.data;

        if (data.status !== 'Pending') {
          setError('This request cannot be edited because its status is no longer Pending.');
          setLoading(false);
          return;
        }

        const dateStr = data.requiredByDate ? data.requiredByDate.split('T')[0] : '';
        setFormData({
          patientName: data.patientName,
          bloodGroup: data.bloodGroup,
          units: data.units,
          hospital: data.hospital,
          requiredByDate: dateStr,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/requests/${id}`, formData);
      navigate('/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading request data...</div>;

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Edit Pending Request</h2>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Patient Name *</label>
          <input
            type="text"
            name="patientName"
            required
            value={formData.patientName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Units Required *</label>
            <input
              type="number"
              name="units"
              min="1"
              required
              value={formData.units}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Hospital *</label>
          <input
            type="text"
            name="hospital"
            required
            value={formData.hospital}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Required-By Date *</label>
          <input
            type="date"
            name="requiredByDate"
            required
            value={formData.requiredByDate}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/my-requests')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 2,
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRequest;
