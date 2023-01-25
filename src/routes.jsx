import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { Dashboard } from "./components/Dashboard/Dashboard";

import { GlobalRoutes } from "./components/Routes/GlobalRoutes";
import { LoginRoutes } from "./components/Routes/LoginRoutes";
import { Graph } from "./components/Graph/Graph";
import { Search } from "./components/Search/Search";

import { Login } from "./pages/Login/Login";
import { MainPages } from "./pages/MainPages/MainPages";
import { Register } from "./pages/Register/Register";
import { Relations } from "./components/Relations/Relations";

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
            path="/search"
            element={<MainPages content={Search} title="Pesquisa" />}
          />
          <Route
            path="/relations"
            element={<MainPages content={Relations} title="Relações" />}
          />
          <Route
            path="/graph/"
            element={<MainPages content={Graph} title="Gerar Grafo" />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
