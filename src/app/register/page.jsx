"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Input,
  Button,
  Card,
  TextField,
  Label,
  FieldError,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  ImageIcon,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = saved === "dark" || (!saved && prefersDark);
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const validatePassword = useCallback((password) => {
    if (password.length < 6) return "Length must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Must have an Uppercase letter";
    if (!/[a-z]/.test(password)) return "Must have a Lowercase letter";
    return "";
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.photoUrl.trim()) newErrors.photoUrl = "Photo URL is required";

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePassword]);

  // Better Auth Email/Password Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await authClient.signUp.email(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: formData.photoUrl,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            setLoading(false);
            toast.success("Registration successful! Welcome to MediQueue.");
            router.push("/");
            router.refresh(); // Refresh to update auth state
          },
          onError: (ctx) => {
            setLoading(false);
            const message = ctx.error?.message || "Registration failed";
            toast.error(message);
          },
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred");
      console.error("Registration error:", error);
    }
  };

  // Better Auth Google Social Login
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            toast.success("Google login successful!");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error?.message || "Google login failed");
          },
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred");
      console.error("Google login error:", error);
    }
  };

  const passwordRequirements = [
    { label: "At least 6 characters", valid: formData.password.length >= 6 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(formData.password) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6366f1] text-white mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Join MediQueue and start learning
          </p>
        </div>

        {/* Registration Card */}
        <Card className="border-0 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 dark:bg-gray-800 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            {/* Name */}
            <TextField
              name="name"
              isRequired
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            >
              <Label className="text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-[#6366f1]" />
                Full Name
              </Label>
              <Input
                placeholder="John Doe"
                className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#6366f1] focus:ring-[#6366f1]/20 mt-1.5 transition-colors"
              />
              <FieldError />
            </TextField>

            {/* Email */}
            <TextField
              name="email"
              isRequired
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            >
              <Label className="text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6366f1]" />
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#6366f1] focus:ring-[#6366f1]/20 mt-1.5 transition-colors"
              />
              <FieldError />
            </TextField>

            {/* Photo URL */}
            <TextField
              name="photoUrl"
              isRequired
              value={formData.photoUrl}
              onChange={(value) => handleChange("photoUrl", value)}
              isInvalid={!!errors.photoUrl}
              errorMessage={errors.photoUrl}
            >
              <Label className="text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#6366f1]" />
                Photo URL
              </Label>
              <Input
                placeholder="https://example.com/photo.jpg"
                className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#6366f1] focus:ring-[#6366f1]/20 mt-1.5 transition-colors"
              />
              <FieldError />
            </TextField>

            {/* Photo Preview */}
            {formData.photoUrl && (
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.photoUrl}
                    alt="Profile preview"
                    fill
                    className="rounded-full object-cover border-2 border-[#6366f1]/20"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <TextField
              name="password"
              isRequired
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
            >
              <Label className="text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6366f1]" />
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#6366f1] focus:ring-[#6366f1]/20 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError />
            </TextField>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Password must contain:
              </p>
              <div className="space-y-1.5">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.valid
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {req.valid ? (
                        <Sparkles className="w-2.5 h-2.5" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        req.valid
                          ? "text-green-600 dark:text-green-400 font-medium"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              spinner={<Loader2 className="w-4 h-4 animate-spin" />}
              className="w-full rounded-xl py-3 bg-[#6366f1] text-white font-medium hover:bg-[#5558e0] transition-all shadow-lg shadow-indigo-200"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="bordered"
              onPress={handleGoogleLogin}
              isLoading={loading}
              className="w-full rounded-xl py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#6366f1] font-medium hover:text-[#5558e0] transition-colors"
              >
                Login here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;