import React, { useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values) => {
      return await login(values);
    },
    onSuccess: (data) => {
      const role = data?.user?.role;
      if (role === "provider") {
        navigate("/provider/dashbord");
      } else if (role === "driver") {
        navigate("/user/dashbord");
      } else {
        navigate("/home");
      }
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Login failed");
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Log in to access your RoadSOS account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-up">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Login Failed</p>
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
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email")
                .required("Email is required")
                .trim(),
              password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Password is required"),
            })}
            onSubmit={(values) => {
              setError("");
              loginMutation.mutate(values);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                    error={
                      formik.touched.email && formik.errors.email
                        ? formik.errors.email
                        : null
                    }
                    {...formik.getFieldProps("email")}
                  />
                </div>

                {/* Password */}
                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                    error={
                      formik.touched.password && formik.errors.password
                        ? formik.errors.password
                        : null
                    }
                    {...formik.getFieldProps("password")}
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  className="rounded-xl font-semibold text-base shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all duration-200"
                  rightIcon={
                    !loginMutation.isPending ? (
                      <ArrowRight className="w-5 h-5" />
                    ) : null
                  }
                >
                  {loginMutation.isPending ? "Signing in..." : "Log In"}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl text-sm gap-2"
                    leftIcon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    }
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl text-sm gap-2"
                    leftIcon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    }
                  >
                    Apple
                  </Button>
                </div>
              </form>
            )}
          </Formik>

          {/* Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;