import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success("Login successful! Welcome back.");
        navigate("/menu");
      } else {
        toast.error(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle demo login
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoCredentials = {
        email: "demo@example.com",
        password: "demopassword"
      };
      
      const result = await login(demoCredentials);
      if (result.success) {
        toast.success("Demo login successful!");
        navigate("/menu");
      } else {
        toast.error("Demo login failed. Please try manual login.");
      }
    } catch (error) {
      toast.error("An error occurred with demo login.");
      console.error("Demo login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Back navigation */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-red-600 transition duration-300"
      >
        <FaArrowLeft className="mr-2" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-md w-full">
        {/* Main login card */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300">
          {/* Header with decorative element */}
          <div className="relative mb-8">
            <div className="absolute -top-12 -left-4 w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-10"></div>
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-10"></div>
            
            <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h1>
            <p className="text-gray-600 text-center mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition duration-300"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 transition duration-300">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition duration-300"
                  required
                />
              </div>
            </div>
            
            {/* Remember me checkbox removed */}

            <button 
              type="submit" 
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-md hover:from-orange-600 hover:to-red-700 transition duration-300 flex items-center justify-center" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Register link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-600 hover:text-red-700 font-medium inline-flex items-center">
              Register now <FaUserPlus className="ml-1" />
            </Link>
          </p>
        </div>

        {/* Security note */}
        <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure login with SSL encryption
        </div>
      </div>
    </div>
  );
};

export default Login;