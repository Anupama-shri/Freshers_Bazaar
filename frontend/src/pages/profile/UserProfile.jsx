import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userAPI, listingAPI, messageAPI } from "../../services/api";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiEdit,
} from "react-icons/fi";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileResponse = await userAPI.getProfile(userId);
      setProfile(profileResponse.data);

      const listingsResponse = await listingAPI.getUserListings(userId);
      setListings(listingsResponse.data);

      const reviewsResponse = await userAPI.getReviews(userId);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/messages");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-8 items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
              <img
                src={
                  profile.profilePicture || "https://via.placeholder.com/150"
                }
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold">{profile.name}</h1>
                  <p className="text-blue-100">{profile.college}</p>
                </div>
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
                    >
                      <FiEdit /> Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleMessage}
                      className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
                    >
                      <FiMessageSquare /> Message
                    </button>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className="text-3xl font-bold">
                    ⭐ {profile.rating.toFixed(1)}
                  </p>
                  <p className="text-blue-100">
                    Based on {profile.totalReviews} reviews
                  </p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-blue-100 mb-4">{profile.bio}</p>
              )}

              {/* Contact */}
              <div className="flex gap-6 text-sm text-blue-100">
                {isAuthenticated && (
                  <>
                    <span className="flex items-center gap-2">
                      <FiPhone /> {profile.phone}
                    </span>
                    <span className="flex items-center gap-2">
                      <FiMail /> {profile.email}
                    </span>
                  </>
                )}
                <span className="flex items-center gap-2">
                  <FiMapPin /> {profile.college}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8 border-b border-gray-300 mb-8">
          <button
            onClick={() => setActiveTab("listings")}
            className={`py-2 px-4 font-bold transition-colors ${
              activeTab === "listings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-4 font-bold transition-colors ${
              activeTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div>
            {listings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No listings yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group"
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={
                          listing.images[0] ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{listing.price}
                      </p>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${
                          listing.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-lg p-6 shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.reviewer.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={review.reviewer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            {review.reviewer.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-semibold">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
