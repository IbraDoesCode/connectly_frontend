import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import CompleteSignup from "./pages/CompleteSignup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-signup" element={<CompleteSignup />} />
        <Route path="/home" element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="post/:postId" element={<PostDetail />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
