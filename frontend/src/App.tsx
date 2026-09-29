import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>}/>
       <Route
          path="/login"
          element={<LoginPage />}
        />

      <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
