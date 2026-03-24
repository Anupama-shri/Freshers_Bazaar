import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../../services/api";
import {
  signupSuccess,
  setError,
  setLoading,
} from "../../redux/slices/authSlice";
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle } from "react-icons/fi";
import { MdSchool } from "react-icons/md";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    college: Yup.string().required("College is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));
      setApiError("");

      const { confirmPassword, ...signupData } = values;
      const response = await authAPI.signup(signupData);

      dispatch(
        signupSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      navigate("/listings");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Signup failed. Please try again.";
      setApiError(errorMsg);
      dispatch(setError(errorMsg));
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join Fresher's Bazaar community</p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Signup Error</p>
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            college: "",
            phone: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.name && errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="name">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.email && errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="email">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.password && errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="password">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
                <p className="text-gray-500 text-xs mt-1">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="confirmPassword">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              {/* College Field */}
              {/* College Field */}
              <div>
                <label
                  htmlFor="college"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  College Name
                </label>
                <div className="relative">
                  <MdSchool className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    as="select"
                    name="college"
                    id="college"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.college && errors.college
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select your college</option>
                    <option value="PSIT">PSIT</option>
                  </Field>
                </div>
                <ErrorMessage name="college">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="9876543210"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                      touched.phone && errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="phone">
                  {(msg) => (
                    <p className="text-red-600 text-xs mt-0.5">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" required />
                <span className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-700 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
