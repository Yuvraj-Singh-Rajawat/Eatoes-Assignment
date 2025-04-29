import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              THE DIGITAL DINNER
            </h2>
            <p className="mb-4">
              The Digital Diner - Delicious Food at Your Fingertips
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white hover:underline transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 mr-3 mt-1 text-red-500" />
                <span>123 Food Street, Cuisine City</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 text-red-500" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 text-red-500" />
                <span>info@THE DIGITAL DINNER.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Hours</h4>
              <p>Monday - Friday: 9am - 10pm</p>
              <p>Saturday - Sunday: 10am - 11pm</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {year} THE DIGITAL DINNER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
