import React, { useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Mail, Lock, ArrowRight, Shield, X } from "lucide-react";
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
            <div className="w-16 h-16 bg-linear-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                className="text-red-400 hover:text-red-600 
                transition-colors shrink-0"
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