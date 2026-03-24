import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { listingAPI } from "../../services/api";
import { addListing, setError } from "../../redux/slices/listingSlice";
import { FiUploadCloud, FiX } from "react-icons/fi";

function CreateListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be less than 100 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters")
      .required("Description is required"),
    price: Yup.number()
      .positive("Price must be positive")
      .required("Price is required"),
    category: Yup.string().required("Category is required"),
    condition: Yup.string().required("Condition is required"),
    location: Yup.string().required("Location is required"),
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setUploading(true);
      const formData = {
        ...values,
        images: uploadedImages,
      };

      const response = await listingAPI.create(formData);
      dispatch(addListing(response.data.listing));
      navigate("/my-listings");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create listing";
      dispatch(setError(errorMsg));
      alert(errorMsg);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const categories = [
    "Books",
    "Electronics",
    "Furniture",
    "Clothing",
    "Sports",
    "Other",
  ];
  const conditions = ["Like New", "Good", "Fair", "Poor"];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sell an Item</h1>
        <p className="text-gray-600 mb-8">
          Fill in the details below to list your item
        </p>

        <Formik
          initialValues={{
            title: "",
            description: "",
            price: "",
            category: "",
            condition: "",
            location: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {/* Images Section */}
              <div>
                <label className="block text-gray-700 font-bold mb-3">
                  Photos (Up to 5 images)
                </label>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-input"
                    disabled={uploadedImages.length >= 5}
                  />
                  <label
                    htmlFor="image-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FiUploadCloud className="text-4xl text-gray-400" />
                    <p className="text-gray-700 font-medium">
                      Click to upload images
                    </p>
                    <p className="text-gray-500 text-sm">or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Supported formats: JPG, PNG, GIF (Max 5 images)
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Item Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g., Physics Textbook - Year 2"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    touched.title && errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <ErrorMessage name="title">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  placeholder="Describe your item in detail..."
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    touched.description && errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <ErrorMessage name="description">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Price (₹)
                </label>
                <Field
                  type="number"
                  name="price"
                  id="price"
                  placeholder="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    touched.price && errors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <ErrorMessage name="price">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Category
                  </label>
                  <Field
                    as="select"
                    name="category"
                    id="category"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.category && errors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category">
                    {(msg) => (
                      <p className="text-red-600 text-sm mt-1">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div>
                  <label
                    htmlFor="condition"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Condition
                  </label>
                  <Field
                    as="select"
                    name="condition"
                    id="condition"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.condition && errors.condition
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="condition">
                    {(msg) => (
                      <p className="text-red-600 text-sm mt-1">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Location
                </label>
                <Field
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g., Hostel A, Block 3"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    touched.location && errors.location
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <ErrorMessage name="location">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {isSubmitting || uploading
                    ? "Uploading Images..."
                    : "Publish Listing"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/my-listings")}
                  className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateListing;
