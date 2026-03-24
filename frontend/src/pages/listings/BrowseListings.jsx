import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listingAPI } from "../../services/api";
import { setListings, setLoading } from "../../redux/slices/listingSlice";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

function BrowseListings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, loading } = useSelector((state) => state.listings);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  useEffect(() => {
    const nextParams = {};

    if (filters.search) nextParams.search = filters.search;
    if (filters.category) nextParams.category = filters.category;
    if (filters.minPrice) nextParams.minPrice = filters.minPrice;
    if (filters.maxPrice) nextParams.maxPrice = filters.maxPrice;

    setSearchParams(nextParams);
  }, [filters, setSearchParams]);

  const fetchListings = async () => {
    try {
      dispatch(setLoading(true));
      const response = await listingAPI.getAll(filters);
      dispatch(setListings(response.data));
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    setSearchInput("");
  };

  const categories = [
    "Books",
    "Electronics",
    "Furniture",
    "Clothing",
    "Sports",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Browse Listings</h1>
          <p className="text-blue-100">
            Find the perfect items from fellow freshers
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5 mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by item name..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </form>

          {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap gap-2 mt-4 text-sm">
              {filters.search && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Search: {filters.search}
                </span>
              )}
              {filters.category && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Category: {filters.category}
                </span>
              )}
              {filters.minPrice && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Min: Rs. {filters.minPrice}
                </span>
              )}
              {filters.maxPrice && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Max: Rs. {filters.maxPrice}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 bg-white rounded-lg shadow-md p-6 h-fit`}
          >
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <FiX />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Reset Filters
            </button>
          </div>

          {/* Listings Area */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden mb-6 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <FiFilter /> Show Filters
            </button>

            {/* Results */}
            {loading ? (
              <div className="text-center text-gray-500 py-12">
                Loading listings...
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg mb-2">No listings found</p>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6 font-medium">
                  Showing {listings.length} results
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing._id}
                      onClick={() => navigate(`/listings/${listing._id}`)}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="h-48 bg-gray-200 overflow-hidden relative">
                        <img
                          src={
                            listing.images[0] ||
                            "https://via.placeholder.com/400x300"
                          }
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {listing.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>

                        {/* Footer */}
                        <div className="flex justify-between items-center border-t pt-3">
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
                              {listing.seller.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-700">
                                {listing.seller.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Views */}
                        <p className="text-xs text-gray-500 mt-3">
                          👁️ {listing.views} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseListings;
