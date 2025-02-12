import { ReactNode, useEffect, useState } from "react";
import "./App.css";
import useUserStore from "./store/userStore";
import { Navigate, Route, Routes } from "react-router";
import Loader from "./components/Loader";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";

const RedirectAuthenticated = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useUserStore();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUserStore();
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/users/login" />;
  }
  return children;
};

function App() {
  const { fetchUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchUser();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/users"
          element={
            <RedirectAuthenticated>
              <AuthLayout />
            </RedirectAuthenticated>
          }
        >
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/users/login" />} />
        </Route>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events/:id" element={<EventPage />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="create-event" element={<CreateEventPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
