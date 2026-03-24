import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
} from "react-icons/fi";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiShoppingBag className="text-2xl text-blue-400" />
              <span className="font-bold text-xl text-white">
                Fresher's Bazaar
              </span>
            </div>
            <p className="text-sm text-gray-400">
              A trusted marketplace for freshers to buy and sell used items on
              campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="hover:text-blue-400 transition">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/listings?category=Books"
                  className="hover:text-blue-400 transition"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/listings?category=Electronics"
                  className="hover:text-blue-400 transition"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/listings?category=Furniture"
                  className="hover:text-blue-400 transition"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/listings?category=Clothing"
                  className="hover:text-blue-400 transition"
                >
                  Clothing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-bold text-white mb-4">Connect With Us</h3>
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <FiMail />
              support@freshersbazaar.com
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition text-xl"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition text-xl"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition text-xl"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {currentYear} Fresher's Bazaar. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-blue-400 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blue-400 transition">
                Terms of Service
              </Link>
              <Link to="/faq" className="hover:text-blue-400 transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
