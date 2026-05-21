"use client"

import { FieldError, Input, Label, TextField, Button, Card } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
    Mail, Lock, Eye, EyeOff, ArrowRight, 
    AlertCircle, GraduationCap, Globe
} from "lucide-react";

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateField = (name, value) => {
        if (!value || value.trim() === "") {
            toast.error(
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-800">Required Field Empty</p>
                        <p className="text-sm text-red-600">{name} is required</p>
                    </div>
                </div>,
                {
                    duration: 3000,
                    style: {
                        borderRadius: '16px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        padding: '16px 20px',
                        maxWidth: '400px'
                    }
                }
            );
            return false;
        }
        return true;
    };

    const handleGoogleSignIn = () => {
        toast.success("Google Sign In initiated", {
            style: {
                borderRadius: '16px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '16px 20px',
            }
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        let isValid = true;
        isValid = validateField("Email", email) && isValid;
        isValid = validateField("Password", password) && isValid;

        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                
                toast.success(
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowRight className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-800">Welcome back!</p>
                            <p className="text-sm text-green-600">Login successful</p>
                        </div>
                    </div>,
                    {
                        duration: 2000,
                        style: {
                            borderRadius: '16px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#166534',
                            padding: '16px 20px',
                        }
                    }
                );

                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else {
                toast.error(data.message || "Invalid email or password", {
                    style: {
                        borderRadius: '16px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        padding: '16px 20px',
                    }
                });
            }
        } catch (error) {
            toast.error("Connection error. Please try again.", {
                style: {
                    borderRadius: '16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    padding: '16px 20px',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden flex items-center justify-center py-12 px-4">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-100/60 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-indigo-100 shadow-sm mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">MediQueue</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to your account</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        {/* Google Sign In */}
                        <div className="p-8 pb-0">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                            >
                                <Globe className="w-5 h-5 text-blue-500" />
                                Continue with Google
                            </motion.button>

                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-sm text-slate-400 font-medium">or sign in with email</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 pt-0 space-y-5">
                            {/* Email */}
                            <div className="group">
                                <TextField name="email" type="email" isRequired>
                                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2.5 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </Label>
                                    <Input 
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
                                    />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <TextField name="password" type={showPassword ? "text" : "password"} isRequired>
                                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2.5 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => toast("Password reset coming soon!", { icon: '🔧' })}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    type="submit"
                                    isDisabled={loading}
                                    className="w-full relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </motion.div>
                        </form>

                        {/* Footer */}
                        <div className="p-8 pt-0 text-center">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/register")}
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;