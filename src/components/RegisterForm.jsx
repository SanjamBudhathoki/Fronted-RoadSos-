import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button"
import Input from "./Input";
import Card from "./Card";
import { AlertCircle } from "lucide-react";
import { $port } from "../services/axios";

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // React Router navigation hook
  const navigate = useNavigate();

  // Function to register a user
  const registerUser = async (values) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Create a copy so Formik state is not mutated
      const newUser = { ...values };

      // Remove confirmPassword before sending to backend
      delete newUser.confirmPassword;

      const res = await $port.post(
        "/user/register",newUser
      );

      setMessage(res.data?.message || "Registration successful");

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create account"
      );
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-10">
      <Card className="w-full max-w-md">
       <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join RoadSOS to get or provide emergency help</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

          {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
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
              .required("Full name is required"),

               lastName: Yup.string()
              .min(2, "Must be at least 2 characters")
              .max(65, "Maximum 65 characters")
              .required("Full name is required"),

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
              .oneOf(
                [Yup.ref("password"), null],
                "Passwords must match"
              )
              .required("Confirm password is required"),

            gender: Yup.string()
              .oneOf(["male", "female", "preferNotToSay"])
              .required("Gender is required"),

            address: Yup.string()
              .min(2, "Minimum 2 characters")
              .max(55, "Maximum 55 characters")
              .required("Location is required"),

            role: Yup.string()
              .oneOf(["driver", "provider"])
              .required("Role is required"),
          })}
          onSubmit={registerUser}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* first Name */}
              <Input
                label="First Name"
                type="text"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </div>
              )}

              <Input
                label="Last Name"
                type="text"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.lastName}
                </div>
              )}


              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}

              {/* Phone */}
              <Input
                label="Phone Number"
                type="tel"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              )}

              {/* address */}
              <Input
                label="Address"
                type="text"
                {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-500 text-sm">
                  {formik.errors.address}
                </div>
              )}

              {/* Password */}
              <Input
                label="Password"
                type="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              )}

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                )}

              {/* Gender */}
              <div>
                <label className="block mb-2 font-medium">
                  Gender
                </label>

                <select
                  {...formik.getFieldProps("gender")}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="preferNotToSay">
                    Prefer Not To Say
                  </option>
                </select>

                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.gender}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 font-medium">
                  I am a:
                </label>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="driver"
                      checked={formik.values.role === "driver"}
                      onChange={formik.handleChange}
                    />
                    Driver
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="provider"
                      checked={formik.values.role === "provider"}
                      onChange={formik.handleChange}
                    />
                    Provider
                  </label>
                </div>

                {formik.touched.role && formik.errors.role && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.role}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full bg-red-500 text-white py-2 rounded"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-500 hover:text-red-600 font-medium">
                  Log in
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default RegisterForm;