import { AppRoutes } from "./routes";
import { AuthProvider } from "./context/authContext";
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <AuthProvider>
       <ToastContainer 
        theme="dark" 
        autoClose={3000}
        toastStyle={{
          background: "var(--theme-secondary)", 
          color: "var(--text)"
        }}
      />

            <AppRoutes />
    </AuthProvider>
  );
}
