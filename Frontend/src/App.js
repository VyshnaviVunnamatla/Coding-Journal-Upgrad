import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProblemForm from "./components/ProblemForm";
import Home from "./components/ProblemList"; // your problems list page
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-problem" element={<PrivateRoute><ProblemForm /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><ProblemForm /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
