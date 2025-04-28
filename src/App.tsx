import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  const queryClient = new QueryClient();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/home" element={<ProtectedRoutes />}>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="post/:postId" element={<PostDetail />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
