import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard data...</div>;
  if (error) return <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>{error}</div>;
  if (!stats) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Admin Control Center</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Donations This Month</span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#10b981' }}>{stats.donationsThisMonth}</h3>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Pending Requests</span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#f59e0b' }}>{stats.pendingRequestsCount}</h3>
          <Link to="/admin/requests" style={{ color: '#2563eb', fontSize: '0.85rem', textDecoration: 'underline' }}>Review requests →</Link>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Total Registered Donors</span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#3b82f6' }}>{stats.totalDonors}</h3>
          <Link to="/admin/donors" style={{ color: '#2563eb', fontSize: '0.85rem', textDecoration: 'underline' }}>View donor directory →</Link>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Low Stock Blood Groups</span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: stats.lowStockGroups.length > 0 ? '#ef4444' : '#10b981' }}>
            {stats.lowStockGroups.length}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>(&lt; 5 units available)</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Current Blood Stock Status</h3>
          <Link to="/admin/stock" style={{ color: '#ef4444', fontWeight: '600', textDecoration: 'none' }}>Detailed Stock View →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.8rem' }}>
          {stats.stockSummary.map((item) => (
            <div
              key={item.bloodGroup}
              style={{
                border: `1px solid ${item.isLowStock ? '#fca5a5' : '#e5e7eb'}`,
                backgroundColor: item.isLowStock ? '#fef2f2' : '#f9fafb',
                padding: '1rem',
                borderRadius: '6px',
                textAlign: 'center'
              }}
            >
              <h4 style={{ margin: '0 0 0.3rem 0', color: '#dc2626', fontSize: '1.2rem' }}>{item.bloodGroup}</h4>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{item.unitsAvailable}</p>
              <span style={{ fontSize: '0.75rem', color: item.isLowStock ? '#dc2626' : '#6b7280' }}>
                {item.isLowStock ? 'LOW STOCK' : 'units'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
