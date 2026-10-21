import { useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AdminStock = () => {
  const [stockList, setStockList] = useState([]);
  const [minGapDays, setMinGapDays] = useState(90);
  const [gapInput, setGapInput] = useState(90);
  const [loading, setLoading] = useState(true);
  const [updatingGap, setUpdatingGap] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [stockRes, settingRes] = await Promise.all([
        api.get('/stock'),
        api.get('/settings'),
      ]);
      setStockList(stockRes.data);
      setMinGapDays(settingRes.data.value);
      setGapInput(settingRes.data.value);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateGap = async (e) => {
    e.preventDefault();
    setUpdatingGap(true);
    setMsg('');
    setError('');

    try {
      const res = await api.put('/settings', { value: gapInput });
      setMinGapDays(res.data.setting.value);
      setMsg('Donation gap policy updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update setting');
    } finally {
      setUpdatingGap(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading stock levels...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Blood Stock & System Configuration</h2>

      {msg && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#ecfdf5', color: '#065f46', borderRadius: '4px' }}>
          {msg}
        </div>
      )}
      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Available Blood Units by Group</h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Groups with less than 5 units are highlighted as low stock.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {stockList.map((item) => (
            <div
              key={item.bloodGroup}
              style={{
                border: `2px solid ${item.isLowStock ? '#ef4444' : '#10b981'}`,
                backgroundColor: item.isLowStock ? '#fef2f2' : '#f0fdf4',
                padding: '1.2rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827', fontSize: '1.5rem' }}>{item.bloodGroup}</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: item.isLowStock ? '#dc2626' : '#059669' }}>
                {item.unitsAvailable}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: item.isLowStock ? '#fee2e2' : '#d1fae5',
                color: item.isLowStock ? '#991b1b' : '#065f46'
              }}>
                {item.isLowStock ? '⚠️ LOW STOCK' : 'ADEQUATE'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Eligibility Configuration</h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Control the minimum rest period required before a donor can donate again. Current policy: <strong>{minGapDays} days</strong>.
        </p>

        <form onSubmit={handleUpdateGap} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <label style={{ fontWeight: '500' }}>Minimum Gap (Days):</label>
          <input
            type="number"
            min="1"
            value={gapInput}
            onChange={(e) => setGapInput(e.target.value)}
            style={{ width: '120px', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <button
            type="submit"
            disabled={updatingGap}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: updatingGap ? 'not-allowed' : 'pointer'
            }}
          >
            {updatingGap ? 'Saving...' : 'Update Policy'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminStock;
