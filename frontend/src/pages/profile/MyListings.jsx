import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listingAPI } from "../../services/api";
import {
  setUserListings,
  setLoading,
  deleteListing,
} from "../../redux/slices/listingSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

function MyListings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userListings, loading } = useSelector((state) => state.listings);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchMyListings();
    }
  }, [user?._id]);

  const fetchMyListings = async () => {
    try {
      dispatch(setLoading(true));
      const response = await listingAPI.getUserListings(user._id);
      dispatch(setUserListings(response.data));
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        setDeleting(listingId);
        await listingAPI.delete(listingId);
        dispatch(deleteListing(listingId));
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing");
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage your items for sale</p>
        </div>
        <button
          onClick={() => navigate("/create-listing")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiPlus /> Create Listing
        </button>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">
          Loading your listings...
        </div>
      ) : userListings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven't posted any listings yet
          </p>
          <button
            onClick={() => navigate("/create-listing")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-md p-6 flex gap-6 hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <img
                  src={
                    listing.images[0] || "https://via.placeholder.com/300x200"
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{listing.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{listing.price}
                    </p>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${
                        listing.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "Sold"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-2">
                  {listing.description}
                </p>

                {/* Stats */}
                <div className="flex gap-6 mb-4 text-sm text-gray-600">
                  <span>👁️ {listing.views} views</span>
                  <span>❤️ {listing.likes.length} likes</span>
                  <span>📍 {listing.location}</span>
                  <span>
                    📅 {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-listing/${listing._id}`)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    <FiEdit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    disabled={deleting === listing._id}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
