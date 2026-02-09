import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      
      {/* Your existing auth route */}
      <Route path="/auth" element={<Auth />} />
    </Routes>
  </BrowserRouter>
);

export default App;