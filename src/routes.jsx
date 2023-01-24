import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { GlobalRoutes } from "./components/Routes/GlobalRoutes";
import { LoginRoutes } from "./components/Routes/LoginRoutes";

import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";



export function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Auth Rotes */}
        <Route element={<LoginRoutes />}>
          <Route path="/login" element={<Login />} /> {/*Check*/}
          <Route path="/register" element={<Register />} /> {/*Check*/}
        </Route>
        {/* DashBoard Rotes */}
        <Route element={<GlobalRoutes />}>
          <Route
            path="/dashboard"
             element={<Dashboard/>}
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
