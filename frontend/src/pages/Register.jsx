import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    bloodGroup: 'O+',
    dob: '',
    city: '',
    phone: '',
    lastDonationDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        lastDonationDate: formData.lastDonationDate ? formData.lastDonationDate : null,
      };
      const response = await api.post('/auth/register', payload);
      login(response.data);
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Create an Account</h2>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Password *</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Account Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="donor">Donor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
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
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>City *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="e.g. Mumbai, Delhi"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Last Donation Date (Optional)</label>
          <input
            type="date"
            name="lastDonationDate"
            value={formData.lastDonationDate}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
        Already registered? <Link to="/login" style={{ color: '#ef4444', fontWeight: '600' }}>Sign In here</Link>
      </p>
    </div>
  );
};

export default Register;
