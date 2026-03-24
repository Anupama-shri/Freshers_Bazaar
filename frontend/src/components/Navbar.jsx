import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiMessageCircle,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FiShoppingBag className="text-2xl text-blue-600" />
            <span className="font-bold text-xl text-gray-800 hidden sm:inline">
              Fresher's Bazaar
            </span>
            <span className="font-bold text-lg text-blue-600 sm:hidden">
              FB
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/listings"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Browse
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Sell
                </Link>
                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <FiMessageCircle />
                  Messages
                </Link>
                <Link
                  to={`/profile/${user?._id}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <FiUser />
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl text-gray-800"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              to="/listings"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Browse Listings
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sell Item
                </Link>
                <Link
                  to="/my-listings"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  My Listings
                </Link>
                <Link
                  to="/messages"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to={`/profile/${user?._id}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
