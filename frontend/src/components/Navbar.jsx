import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#ef4444' : '#374151',
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    backgroundColor: isActive ? '#fee2e2' : 'transparent',
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.8rem 2rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem', color: '#dc2626' }}>🩸</span>
        <strong style={{ fontSize: '1.25rem', color: '#111827' }}>LifeFlow Blood Bank</strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {user ? (
          <>
            <NavLink to="/profile" style={navLinkStyle}>My Profile</NavLink>
            <NavLink to="/my-donations" style={navLinkStyle}>My Donations</NavLink>
            <NavLink to="/my-requests" style={navLinkStyle}>My Requests</NavLink>
            <NavLink to="/requests/new" style={navLinkStyle}>+ New Request</NavLink>

            {isAdmin && (
              <span style={{ display: 'flex', gap: '0.5rem', borderLeft: '2px solid #e5e7eb', paddingLeft: '1rem' }}>
                <NavLink to="/admin/dashboard" style={navLinkStyle}>Dashboard</NavLink>
                <NavLink to="/admin/stock" style={navLinkStyle}>Stock</NavLink>
                <NavLink to="/admin/requests" style={navLinkStyle}>Admin Requests</NavLink>
                <NavLink to="/admin/donors" style={navLinkStyle}>Donors</NavLink>
                <NavLink to="/admin/donations/new" style={navLinkStyle}>+ Record Donation</NavLink>
              </span>
            )}

            <button
              onClick={handleLogout}
              style={{
                marginLeft: '1rem',
                padding: '0.4rem 0.9rem',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout ({user.name.split(' ')[0]})
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
            <NavLink to="/register" style={navLinkStyle}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
