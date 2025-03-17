import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterAdmin from "./components/RegisterAdmin";
import Assesment from "./components/Assesment";
import AdminHome from "./pages/AdminHome";
import UploadTest from "./components/UploadTest";
import PreviousTests from "./components/PreviousTests";
import EditTest from "./components/EditTest";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterStudent from "./components/RegisterStudent";
import ContactPage from "./components/Contact";
import About from "./components/About";
import Features from "./components/Features";
import AdminChat from "./components/AdminChat";
import AdminTests from "./components/AdminTests";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterAdmin />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute requiredRole="admin"><UploadTest /></ProtectedRoute>} />
      <Route path="/previous-tests" element={<ProtectedRoute requiredRole="admin"><PreviousTests /></ProtectedRoute>} />
      <Route path="/edit-test" element={<ProtectedRoute requiredRole="admin"><EditTest /></ProtectedRoute>} />
      <Route path="/register-student" element={<ProtectedRoute requiredRole="admin"><RegisterStudent /></ProtectedRoute>} />
      <Route path="reports" element={<ProtectedRoute requiredRole="admin"><AdminTests/></ProtectedRoute>} />

      {/* Chat Protected Route */}
      <Route path="/chats" element={<ProtectedRoute requiredRole="admin"><AdminChat /></ProtectedRoute>} />

      {/* Student Protected Route */}
      <Route path="/assessment" element={<ProtectedRoute requiredRole="student"><Assesment /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
