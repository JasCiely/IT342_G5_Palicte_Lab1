import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Create axios instance with credentials
  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Check authentication status on mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/check');
      
      if (response.status === 200 && response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        
        // Sync with localStorage (optional, for UI consistency)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userRole", response.data.role);
      } else {
        handleAuthFailure();
      }
    } catch (error) {
      console.log("Not authenticated");
      handleAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthFailure = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.clear();
  };

  // Function to handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    // Store in localStorage as backup
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userRole", userData.role);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.clear();
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects based on auth status */}
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
          } 
        />
        
        {/* Auth page - redirect to dashboard if already logged in */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Auth onLogin={handleLogin} />
          } 
        />
        
        {/* Protected Dashboard - redirect to auth if not logged in */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/auth" replace />
          } 
        />
        
        {/* Catch all - redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;