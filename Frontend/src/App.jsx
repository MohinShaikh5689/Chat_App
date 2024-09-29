import React, { useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/sidebar';
import ChatPage from './pages/chatPage';
import './App.css';

// Protect only the authenticated routes
const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Sidebar />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoutes>
              <ChatPage />
            </ProtectedRoutes>
          }/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
