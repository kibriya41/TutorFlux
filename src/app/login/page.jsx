"use client";

import { FieldError, Input, Label, TextField, Button, Card } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
    Mail, Lock, Eye, EyeOff, ArrowRight, 
    AlertCircle, GraduationCap, Globe
} from "lucide-react";

// Better Auth Client
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Auto-detect dark mode from Navbar toggle
    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const validateField = (name, value) => {
        if (!value || value.trim() === "") {
            toast.error(
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className={`font-semibold ${isDark ? 'text-red-200' : 'text-red-800'}`}>Required Field Empty</p>
                        <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{name} is required</p>
                    </div>
                </div>,
                {
                    duration: 3000,
                    style: {
                        borderRadius: '16px',
                        background: isDark ? '#1a1a2e' : '#fef2f2',
                        border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                        color: isDark ? '#fca5a5' : '#991b1b',
                        padding: '16px 20px',
                        maxWidth: '400px'
                    }
                }
            );
            return false;
        }
        return true;
    };

    // Better Auth: Google Sign In (Social Provider)
    const handleGoogleSignIn = async () => {
        setLoading(true);
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        }, {
            onRequest: () => {
                toast.success("Redirecting to Google...", {
                    style: {
                        borderRadius: '16px',
                        background: isDark ? '#064e3b' : '#f0fdf4',
                        border: isDark ? '1px solid #059669' : '1px solid #bbf7d0',
                        color: isDark ? '#6ee7b7' : '#166534',
                        padding: '16px 20px',
                    }
                });
            },
            onError: (ctx) => {
                setLoading(false);
                toast.error(ctx.error.message || "Google sign in failed", {
                    style: {
                        borderRadius: '16px',
                        background: isDark ? '#1a1a2e' : '#fef2f2',
                        border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                        color: isDark ? '#fca5a5' : '#991b1b',
                        padding: '16px 20px',
                    }
                });
            }
        });
    };

    // Better Auth: Email/Password Sign In
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

        // Use Better Auth's type-safe signIn.email method
        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: "/",
                rememberMe: true,
            },
            {
                onRequest: () => {
                    // Loading state already set above
                },
                onSuccess: async () => {
                    try {
                        const tokenRes = await fetch("http://localhost:7000/jwt", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                        });
                        const tokenData = await tokenRes.json();
                        if (tokenData.token) {
                            localStorage.setItem("token", tokenData.token);
                        }
                    } catch (err) {
                        console.error("JWT creation failed on login", err);
                    }

                    toast.success(
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                                <ArrowRight className={`w-3 h-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            </div>
                            <div>
                                <p className={`font-semibold ${isDark ? 'text-green-200' : 'text-green-800'}`}>Welcome back!</p>
                                <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Login successful</p>
                            </div>
                        </div>,
                        {
                            duration: 2000,
                            style: {
                                borderRadius: '16px',
                                background: isDark ? '#064e3b' : '#f0fdf4',
                                border: isDark ? '1px solid #059669' : '1px solid #bbf7d0',
                                color: isDark ? '#6ee7b7' : '#166534',
                                padding: '16px 20px',
                            }
                        }
                    );

                    setTimeout(() => {
                        router.push("/");
                    }, 1000);
                },
                onError: (ctx) => {
                    setLoading(false);
                    toast.error(ctx.error.message || "Invalid email or password", {
                        style: {
                            borderRadius: '16px',
                            background: isDark ? '#1a1a2e' : '#fef2f2',
                            border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
                            color: isDark ? '#fca5a5' : '#991b1b',
                            padding: '16px 20px',
                        }
                    });
                },
            }
        );
    };

    // Dynamic theme classes
    const themeClasses = {
        pageBg: isDark ? "bg-[#0a0e1a]" : "bg-[#f8fafc]",
        cardBg: isDark ? "bg-gray-900/80 border-gray-800" : "bg-white border-slate-200",
        inputBg: isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400",
        inputFocus: isDark ? "focus:border-blue-500 focus:ring-blue-900/30" : "focus:border-indigo-400 focus:ring-indigo-100",
        textPrimary: isDark ? "text-white" : "text-slate-900",
        textSecondary: isDark ? "text-gray-400" : "text-slate-500",
        textMuted: isDark ? "text-gray-500" : "text-slate-400",
        divider: isDark ? "bg-gray-700" : "bg-slate-200",
        googleBtn: isDark ? "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        linkColor: isDark ? "text-blue-400 hover:text-blue-300" : "text-indigo-600 hover:text-indigo-700",
        forgotLink: isDark ? "text-blue-400 hover:text-blue-300" : "text-indigo-600 hover:text-indigo-700",
    };

    return (
        <div className={`min-h-screen ${themeClasses.pageBg} relative overflow-hidden flex items-center justify-center py-12 px-4 transition-colors duration-500`}>
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] ${isDark ? 'bg-blue-900/20' : 'bg-indigo-100/60'}`}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className={`absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[80px] ${isDark ? 'bg-purple-900/20' : 'bg-purple-100/60'}`}
                />
                <div className={`absolute inset-0 bg-[radial-gradient(circle,${isDark ? '#1e293b' : '#e2e8f0'}_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 transition-colors duration-500`} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-sm mb-6 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-indigo-100'}`}>
                        <img src="/logo.png" alt="TutorFlux" className="w-10 h-10 rounded-xl object-cover" />
                        <span className={`text-xl font-bold ${themeClasses.textPrimary}`}>TutorFlux</span>
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${themeClasses.textPrimary}`}>Welcome Back</h1>
                    <p className={themeClasses.textSecondary}>Sign in to your account</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className={`${themeClasses.cardBg} shadow-xl overflow-hidden transition-colors duration-500`}>
                        {/* Google Sign In */}
                        <div className="p-8 pb-0">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all shadow-sm ${themeClasses.googleBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Globe className="w-5 h-5 text-blue-500" />
                                Continue with Google
                            </motion.button>

                            <div className="flex items-center gap-4 my-6">
                                <div className={`flex-1 h-px ${themeClasses.divider}`} />
                                <span className={`text-sm font-medium ${themeClasses.textMuted}`}>or sign in with email</span>
                                <div className={`flex-1 h-px ${themeClasses.divider}`} />
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 pt-0 space-y-5">
                            {/* Email */}
                            <div className="group">
                                <TextField name="email" type="email" isRequired>
                                    <Label className={`flex items-center gap-2 text-sm font-semibold mb-2.5 group-focus-within:text-blue-500 transition-colors ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </Label>
                                    <Input 
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                                    />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <TextField name="password" type={showPassword ? "text" : "password"} isRequired>
                                    <Label className={`flex items-center gap-2 text-sm font-semibold mb-2.5 group-focus-within:text-blue-500 transition-colors ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className={`w-full px-5 py-4 pr-14 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
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
                                    className={`text-sm font-medium transition-colors ${themeClasses.forgotLink}`}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    type="submit"
                                    isDisabled={loading}
                                    className="w-full relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
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
                            <p className={`text-sm ${themeClasses.textSecondary}`}>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/register")}
                                    className={`font-semibold transition-colors ${themeClasses.linkColor}`}
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