import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { listingAPI, messageAPI, userAPI } from "../../services/api";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiTrash2,
} from "react-icons/fi";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getById(id);
      setListing(response.data);

      // Fetch seller info
      const sellerResponse = await userAPI.getProfile(response.data.seller._id);
      setSeller(sellerResponse.data);

      // Fetch reviews
      const reviewsResponse = await userAPI.getReviews(
        response.data.seller._id,
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/messages");
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !isAuthenticated) return;

    try {
      setSending(true);
      await messageAPI.sendMessage(listing.seller._id, {
        message: messageText,
        listing: id,
      });
      setMessageText("");
      alert("Message sent successfully!");
      navigate("/messages");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert("Please enter a review comment");
      return;
    }

    try {
      setSubmittingReview(true);
      await userAPI.createReview(listing.seller._id, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
        listing: id,
      });

      const [reviewsResponse, sellerResponse] = await Promise.all([
        userAPI.getReviews(listing.seller._id),
        userAPI.getProfile(listing.seller._id),
      ]);

      setReviews(reviewsResponse.data);
      setSeller(sellerResponse.data);
      setReviewForm({ rating: 5, comment: "" });
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const currentUserId = user?._id || user?.id;
  const sellerId = listing?.seller?._id || seller?._id;
  const isOwner = Boolean(currentUserId && sellerId && currentUserId === sellerId);

  const handleDeleteListing = async () => {
    if (!isOwner) return;

    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      setDeleting(true);
      await listingAPI.delete(id);
      alert("Listing deleted successfully!");
      navigate("/my-listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Listing not found</p>
          <button
            onClick={() => navigate("/listings")}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <button
        onClick={() => navigate("/listings")}
        className="sticky top-20 left-4 z-10 flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 bg-white px-4 py-2 rounded-lg shadow"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 h-96">
              <img
                src={listing.images[0] || "https://via.placeholder.com/600x400"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {listing.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${listing.title} ${idx}`}
                  className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Category & Status */}
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                {listing.status}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                {listing.condition}
              </span>
            </div>

            {/* Title & Price */}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {listing.title}
            </h1>
            <p className="text-5xl font-bold text-blue-600 mb-6">
              ₹{listing.price}
            </p>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <FiMapPin /> Location
                </p>
                <p className="font-semibold text-gray-800 mt-1">
                  {listing.location}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <FiCalendar /> Posted
                </p>
                <p className="font-semibold text-gray-800 mt-1">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser /> Seller Information
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    seller?.profilePicture || "https://via.placeholder.com/60"
                  }
                  alt={seller?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-800">{seller?.name}</p>
                  <p className="text-gray-600 text-sm">{seller?.college}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">
                      {seller?.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({seller?.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm mb-2">
                  Contact Information
                </p>
                {isAuthenticated ? (
                  <>
                    <p className="font-semibold text-gray-800">
                      {seller?.phone}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {seller?.email}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600">Login to see contact details</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {isOwner ? (
                <button
                  onClick={handleDeleteListing}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <FiTrash2 /> {deleting ? "Deleting..." : "Delete Listing"}
                </button>
              ) : (
                <button
                  onClick={handleMessageClick}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FiMessageSquare /> Message Seller
                </button>
              )}
              <button
                onClick={() => setLiked(!liked)}
                className={`px-4 py-3 rounded-lg font-bold transition flex items-center gap-2 ${
                  liked
                    ? "bg-red-50 text-red-600 border border-red-600"
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:border-red-600"
                }`}
              >
                <FiHeart className={liked ? "fill-current" : ""} />
              </button>
              <button className="px-4 py-3 rounded-lg font-bold border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2">
                <FiShare2 />
              </button>
            </div>

            {/* Quick Message */}
            {isAuthenticated && !isOwner && (
              <div className="relative z-10 bg-white rounded-lg p-6 shadow-md border border-gray-100 mt-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Send Quick Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi, is this item still available?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  rows="3"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !messageText.trim()}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Reviews ({reviews.length})
          </h2>
          {isAuthenticated && user?._id !== seller?._id && user?.id !== seller?._id && (
            <form onSubmit={handleReviewSubmit} className="mb-8 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Leave a Review for the Seller
              </h3>
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-2">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Bad</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Share your experience with this seller"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.reviewer.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
