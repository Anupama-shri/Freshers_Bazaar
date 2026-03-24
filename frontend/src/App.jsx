import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import BrowseListings from "./pages/listings/BrowseListings";
import ListingDetail from "./pages/listings/ListingDetail";
import CreateListing from "./pages/listings/CreateListing";
import UserProfile from "./pages/profile/UserProfile";
import MyListings from "./pages/profile/MyListings";
import Messages from "./pages/chat/Messages";
import { userAPI } from "./services/api";
import { setUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      userAPI
        .getCurrentUser()
        .then((res) => dispatch(setUser(res.data)))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [isAuthenticated, token, dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="grow max-w-7xl mx-auto w-full px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/listings" element={<BrowseListings />} />
            <Route path="/listings/:id" element={<ListingDetail />} />

            {/* Protected Routes */}
            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
