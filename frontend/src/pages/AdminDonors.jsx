import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (city) params.city = city;
      if (search) params.search = search;

      const response = await api.get('/donors', { params });
      setDonors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donor list');
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, city, search]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#111827' }}>Registered Donors Directory</h2>
        <Link
          to="/admin/donations/new"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          + Record Donation
        </Link>
      </div>

      <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Search by City</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Search Name / Phone</label>
            <input
              type="text"
              placeholder="Name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.55rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Filter Donors
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Searching donors...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>{error}</div>
      ) : donors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No donors matching the specified criteria.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Name</th>
                <th style={{ padding: '0.8rem 1rem' }}>Blood Group</th>
                <th style={{ padding: '0.8rem 1rem' }}>City</th>
                <th style={{ padding: '0.8rem 1rem' }}>Phone</th>
                <th style={{ padding: '0.8rem 1rem' }}>Eligibility</th>
                <th style={{ padding: '0.8rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>{d.name}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 'bold', color: '#dc2626' }}>{d.bloodGroup}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{d.city}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{d.phone}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      backgroundColor: d.eligibility.isEligible ? '#ecfdf5' : '#fee2e2',
                      color: d.eligibility.isEligible ? '#065f46' : '#991b1b',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {d.eligibility.isEligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <Link
                      to={`/admin/donors/${d._id}`}
                      style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'underline' }}
                    >
                      View Details
                    </Link>
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

export default AdminDonors;
