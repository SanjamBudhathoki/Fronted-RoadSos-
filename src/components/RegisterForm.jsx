import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import {
  AlertCircle,
  CheckCircle2,
  UserPlus,
  X,
  Car,
  Truck,
  ChevronRight,
} from "lucide-react";
import { $port } from "../services/axios";

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (values) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const newUser = { ...values };
      delete newUser.confirmPassword;

      const res = await $port.post("/user/register", newUser);

      setMessage(res.data?.message || "Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-10">
      <Card className="w-full max-w-2xl rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Join RoadSOS to get or provide emergency help
            </p>
          </div>

          {/* Success Alert */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-slide-up">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Success!</p>
                <p className="text-sm text-emerald-600 mt-0.5">{message}</p>
              </div>
              <button
                onClick={() => setMessage("")}
                className="text-emerald-400 hover:text-emerald-600 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-up">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Registration Failed
                </p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
              gender: "",
              address: "",
              role: "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string()
                .min(2, "Must be at least 2 characters")
                .max(65, "Maximum 65 characters")
                .required("First name is required"),
              lastName: Yup.string()
                .min(2, "Must be at least 2 characters")
                .max(65, "Maximum 65 characters")
                .required("Last name is required"),
              email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
              phone: Yup.string()
                .min(7, "Invalid phone number")
                .required("Phone number is required"),
              password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Password is required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
              gender: Yup.string()
                .oneOf(["male", "female", "preferNotToSay"])
                .required("Gender is required"),
              address: Yup.string()
                .min(2, "Minimum 2 characters")
                .max(55, "Maximum 55 characters")
                .required("Location is required"),
              role: Yup.string()
                .oneOf(["user", "provider"])
                .required("Role is required"),
            })}
            onSubmit={registerUser}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="John"
                      error={
                        formik.touched.firstName && formik.errors.firstName
                          ? formik.errors.firstName
                          : null
                      }
                      {...formik.getFieldProps("firstName")}
                    />
                  </div>
                  <div>
                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Doe"
                      error={
                        formik.touched.lastName && formik.errors.lastName
                          ? formik.errors.lastName
                          : null
                      }
                      {...formik.getFieldProps("lastName")}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      error={
                        formik.touched.email && formik.errors.email
                          ? formik.errors.email
                          : null
                      }
                      {...formik.getFieldProps("email")}
                    />
                  </div>
                  <div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      error={
                        formik.touched.phone && formik.errors.phone
                          ? formik.errors.phone
                          : null
                      }
                      {...formik.getFieldProps("phone")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Input
                    label="Address"
                    type="text"
                    placeholder="123 Emergency Street, City"
                    error={
                      formik.touched.address && formik.errors.address
                        ? formik.errors.address
                        : null
                    }
                    {...formik.getFieldProps("address")}
                  />
                </div>

                {/* Password Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Min. 6 characters"
                      error={
                        formik.touched.password && formik.errors.password
                          ? formik.errors.password
                          : null
                      }
                      {...formik.getFieldProps("password")}
                    />
                  </div>
                  <div>
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Re-enter password"
                      error={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? formik.errors.confirmPassword
                          : null
                      }
                      {...formik.getFieldProps("confirmPassword")}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    {...formik.getFieldProps("gender")}
                    className={`
                      w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none bg-white text-gray-700
                      ${
                        formik.touched.gender && formik.errors.gender
                          ? "border-red-300 focus:ring-2 focus:ring-red-200"
                          : formik.touched.gender && !formik.errors.gender
                          ? "border-emerald-300 focus:ring-2 focus:ring-emerald-200"
                          : "border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-transparent hover:border-gray-300"
                      }
                    `}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="preferNotToSay">Prefer Not To Say</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formik.errors.gender}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700">
                    I want to register as a:
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* user */}
                    <label
                      className={`
                        relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          formik.values.role === "user"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formik.values.role === "user"}
                        onChange={formik.handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          formik.values.role === "user"
                            ? "bg-red-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Car
                          className={`w-5 h-5 ${
                            formik.values.role === "user"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          User
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Need emergency assistance
                        </p>
                      </div>
                      {formik.values.role === "user" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </label>

                    {/* Provider */}
                    <label
                      className={`
                        relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          formik.values.role === "provider"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="provider"
                        checked={formik.values.role === "provider"}
                        onChange={formik.handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          formik.values.role === "provider"
                            ? "bg-red-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Truck
                          className={`w-5 h-5 ${
                            formik.values.role === "provider"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Provider
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Provide emergency services
                        </p>
                      </div>
                      {formik.values.role === "provider" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </label>
                  </div>
                  {formik.touched.role && formik.errors.role && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formik.errors.role}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="rounded-xl font-semibold text-base shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all duration-200 mt-2"
                  rightIcon={
                    !loading ? <ChevronRight className="w-5 h-5" /> : null
                  }
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 underline-offset-2 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;