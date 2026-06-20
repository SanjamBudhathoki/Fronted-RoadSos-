import React, { useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { $port } from "../services/axios";
import { AlertCircle } from "lucide-react";
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
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Log in to access your RoadSOS account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
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
            loginMutation.mutate(values);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
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

              <Button
                type="submit"
                variant="primary"
                disabled={loginMutation.isPending}
                className=" mt-2 w-full bg-red-500 text-white py-2  rounded"
              >
                {loginMutation.isPending ? "Signing In..." : "Log In"}
              </Button>
            </form>
          )}
        </Formik>

        <div className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;