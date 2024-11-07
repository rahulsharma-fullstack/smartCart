import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full h-12 px-6 flex items-center justify-center border border-gray-300 rounded-md space-x-3 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center text-xs text-gray-500 uppercase">
            <span className="px-2 bg-white">Or continue with</span>
            <div className="absolute w-full h-px bg-gray-200"></div>
          </div>

          <button 
            className="w-full h-12 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            onClick={() => navigate('/signup')}
          >
            Create an account
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-800">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-gray-800">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
}
