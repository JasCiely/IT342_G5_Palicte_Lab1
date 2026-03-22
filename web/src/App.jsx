import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
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

  // Check authentication status on mount
  useEffect(() => {
    // Don't check auth if we're on the auth page
    if (window.location.pathname === '/auth') {
      setIsLoading(false);
      return;
    }
    
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log("🔍 Checking auth status...");
    
    // First, check if user is a guest (client-side only)
    const authStatus = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("userData");

    console.log("📝 LocalStorage:", { authStatus, userRole, hasUserData: !!userData });

    if (authStatus === "guest" || userRole === "GUEST") {
      // Guest user - no server check needed, handle immediately
      console.log("👤 Guest session detected");
      handleGuestSession(userData);
      return; // Exit early - don't call server
    }

    // Only check server for authenticated users
    if (authStatus === "true") {
      console.log("🌐 Checking with server...");
      try {
        const response = await api.get('/auth/check');
        
        if (response.status === 200 && response.data) {
          console.log("✅ Authenticated session valid");
          handleAuthenticatedSession(response.data);
        } else {
          console.log("❌ Server auth failed");
          handleAuthFailure();
        }
      } catch (error) {
        console.log("⚠️ Server check error:", error.message);
        // If server rejects, session is invalid - clear everything
        handleAuthFailure();
      }
    } else {
      // No auth status or invalid
      console.log("🚫 No valid session");
      handleAuthFailure();
    }
  };

  const handleGuestSession = (userDataString) => {
    try {
      const guestData = userDataString ? JSON.parse(userDataString) : {
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@eventwear.com',
        role: 'GUEST',
        isGuest: true
      };
      
      setIsGuest(true);
      setIsAuthenticated(true); // Allow access to dashboard
      setUser(guestData);
      setIsLoading(false); // Stop loading
      console.log("Guest session active");
    } catch (e) {
      console.error("Failed to parse guest data:", e);
      handleAuthFailure();
    }
  };

  const handleAuthenticatedSession = (userData) => {
    setIsAuthenticated(true);
    setIsGuest(false);
    setUser(userData);
    setIsLoading(false); // Stop loading
    
    // Sync with localStorage (but backend is source of truth)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userRole", userData.role || "USER");
    localStorage.setItem("userData", JSON.stringify(userData));
    
    console.log("Authenticated session active");
  };

  const handleAuthFailure = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
    setIsLoading(false); // Stop loading
    // Clear potentially tampered localStorage
    localStorage.clear();
  };

  // Function to handle login (both guest and authenticated)
  const handleLogin = (userData) => {
    if (userData.isGuest || userData.role === 'GUEST') {
      // Guest login - client-side only
      setIsGuest(true);
      setIsAuthenticated(true);
      setUser(userData);
      
      localStorage.setItem("isAuthenticated", "guest");
      localStorage.setItem("userRole", "GUEST");
      localStorage.setItem("userData", JSON.stringify(userData));
      
      console.log("Guest user logged in");
    } else {
      // Authenticated login - backend verified
      setIsAuthenticated(true);
      setIsGuest(false);
      setUser(userData);
      
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userRole", userData.role || "USER");
      localStorage.setItem("userData", JSON.stringify(userData));
      
      console.log("Authenticated user logged in");
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    // Only call server logout for authenticated users, not guests
    if (!isGuest && isAuthenticated) {
      try {
        await api.post('/auth/logout');
        console.log("Logged out successfully from server");
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else {
      console.log("Guest session cleared");
    }
    
    // Clear local state
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
    localStorage.clear();
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '16px',
        color: '#718096',
        background: 'linear-gradient(135deg, #f8f7f5 0%, #f0edea 50%, #e8e5e1 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(107, 45, 57, 0.1)',
            borderTopColor: '#6b2d39',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div>Loading EventWear...</div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
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
        
        {/* Auth page - redirect to dashboard if already logged in (including guest) */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Auth onLogin={handleLogin} />
          } 
        />
        
        {/* Dashboard - accessible by both authenticated users and guests */}
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