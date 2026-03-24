import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { listingAPI } from "../services/api";
import {
  FiArrowRight,
  FiSearch,
  FiTrendingUp,
  FiShield,
  FiZap,
} from "react-icons/fi";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getAll({ limit: 6 });
      setFeaturedListings(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Fresher's Bazaar
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            The ultimate marketplace for college freshers to buy and sell used
            items
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2 bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for books, electronics, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-3 text-gray-800 outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-6 py-3 hover:bg-blue-700 transition flex items-center gap-2 font-medium"
              >
                <FiSearch />
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/listings")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2"
            >
              Browse Items <FiArrowRight />
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition border-2 border-white"
              >
                Join Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">500+</p>
            <p className="text-gray-600 mt-2">Active Listings</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">1000+</p>
            <p className="text-gray-600 mt-2">Happy Buyers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">50K+</p>
            <p className="text-gray-600 mt-2">Items Sold</p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Featured Items
              </h2>
              <p className="text-gray-600">
                Check out what's trending on Fresher's Bazaar
              </p>
            </div>
            <button
              onClick={() => navigate("/listings")}
              className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2"
            >
              View All <FiArrowRight />
            </button>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center text-gray-500">
              Loading featured items...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <div
                  key={listing._id}
                  onClick={() => navigate(`/listings/${listing._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={
                        listing.images[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {listing.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mb-2 truncate">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center border-t pt-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{listing.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          {listing.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          By {listing.seller.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-700">
                            {listing.seller.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Direct from college students means lower prices and better deals
                than retail.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Verified users and secure messaging ensure safe transactions for
                everyone.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                Simple interface designed specifically for college students and
                their needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-blue-100 mb-8">
              Join thousands of freshers already buying and selling on our
              platform
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              Create Your Account
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
