import App from "@/App";
import { Route, Router, Routes } from "react-router-dom";
import Signup from "../auth/signup/Signup";
import Login from "../auth/login/Login";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Parent Route */}
        <Route path="/" element={<App />}>
          {/* Child Routes */}
          <Route path="auth/signup" element={<Signup />} />
          <Route path="auth/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
