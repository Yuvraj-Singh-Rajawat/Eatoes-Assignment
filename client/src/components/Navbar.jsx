import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-red-600">
              THE DIGITAL DINNER
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="py-2 px-3 text-gray-700 hover:text-red-600 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="py-2 px-3 text-gray-700 hover:text-red-600 transition duration-300"
            >
              Menu
            </Link>

            {user ? (
              <>
                <Link
                  to="/cart"
                  className="py-2 px-3 text-gray-700 hover:text-red-600 transition duration-300 relative"
                >
                  <div className="flex items-center">
                    <FaShoppingCart className="mr-1" />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
                <Link
                  to="/orders"
                  className="py-2 px-3 text-gray-700 hover:text-red-600 transition duration-300"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-4 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-300 ml-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && cartItemCount > 0 && (
              <Link to="/cart" className="mr-4 relative">
                <FaShoppingCart className="text-gray-700 text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-white border-t border-gray-200`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({cartItemCount})
              </Link>
              <Link
                to="/orders"
                className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <button
                className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
