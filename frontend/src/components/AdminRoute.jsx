import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
        <Link to="/profile" style={{ color: '#2563eb', textDecoration: 'underline' }}>Back to Profile</Link>
      </div>
    );
  }
  return children;
};
export default AdminRoute;
