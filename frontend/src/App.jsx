import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyDonations from './pages/MyDonations';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import EditRequest from './pages/EditRequest';

import AdminDashboard from './pages/AdminDashboard';
import AdminStock from './pages/AdminStock';
import AdminDonors from './pages/AdminDonors';
import AdminDonorDetail from './pages/AdminDonorDetail';
import NewDonation from './pages/NewDonation';
import AdminRequests from './pages/AdminRequests';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <main style={{ paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Donor Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/my-requests/:id/edit" element={<ProtectedRoute><EditRequest /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/stock" element={<ProtectedRoute><AdminRoute><AdminStock /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/donors" element={<ProtectedRoute><AdminRoute><AdminDonors /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/donors/:id" element={<ProtectedRoute><AdminRoute><AdminDonorDetail /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/donations/new" element={<ProtectedRoute><AdminRoute><NewDonation /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute><AdminRoute><AdminRequests /></AdminRoute></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
