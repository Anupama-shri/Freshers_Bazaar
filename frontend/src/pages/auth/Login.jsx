import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "../../services/api";
import {
  loginSuccess,
  setError,
  setLoading,
} from "../../redux/slices/authSlice";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));
      setApiError("");

      const response = await authAPI.login({
        ...values,
        email: values.email.trim().toLowerCase(),
      });

      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      navigate("/listings");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
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
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Login to your Fresher's Bazaar account
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Login Error</p>
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.email && errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="email">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.password && errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <ErrorMessage name="password">
                  {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                </ErrorMessage>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link
                  to="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Login"}
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

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Login Note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <p className="text-amber-900 font-medium mb-1">Login Note</p>
          <p className="text-amber-800">
            Use the email and password from the account you created on the
            signup page. The old hardcoded demo credentials were removed because
            they no longer match the saved account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
