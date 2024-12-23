import { useState } from 'react';
import "../styles/login.css";
import eye from "../assets/eye.svg";
import eyeOff from "../assets/eye-off.svg";
import mail from "../assets/mail.svg";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assest';
import "../styles/about.css";
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = useState(false);

  const baseUrl = import.meta.env.VITE_BASEURL;
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLogging(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      // Check if the login is successful
      if (response.data.success === true) {
        // Check if the user is an admin, otherwise show unauthorized error
       
        toast.success(response?.data?.message);
      
        setEmail('');
        setPassword('');
        window.location.assign("/admin-dashboard");
        
      } else {
        toast.error("Login failed! Invalid credentials.");
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error codes
        if (error.response.status === 404) {
          toast.error('Email or Password is incorrect or User Details Not Found');
        } else if (error.response.status === 409) {
          toast.error('Account issues or incorrect credentials');
        } else if (error.response.status === 401) {
          toast.error('Unauthorized access - Please check your credentials');
        } else {
          toast.error('An error occurred. Please try again later');
        }
      } else if (error.request) {
        toast.error('No response from server. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLogging(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <div className="hero-container">
          <div className="description">
            <div className="login-grid-1">
              <div>
                <h3 className="welcome">Welcome <span style={{ color: "black" }}>Back ADMIN</span></h3>
                <p className="welcome-2">Please Enter Your Details</p>
                <form onSubmit={handleSubmit}>
                  <div className="email-container">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="password-input-box"
                      id="email"
                    />
                    <div className="absolut">
                      <img src={mail} alt="" />
                    </div>
                  </div>

                  <div className="password-container">
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="password-input-box"
                      />
                      <div className="eye-button" onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}>
                        <img src={showPassword ? eye : eyeOff} alt={showPassword ? "Hide password" : "Show password"} />
                      </div>
                    </div>
                  </div>

                  <div className="links-forgot">
                    <Link to="/forgot-password">
                      <span className="forgot cursor-pointer">Forgotten Password?</span>
                    </Link>
                  </div>

                  <div>
                    <button type="submit"
                      disabled={logging}
                      className="login-button">
                      {logging ? (
                        <div className="flex items-center space-x-2 justify-center">
                          <span className="animate-pulse">Loading</span>{" "}
                          <FaSpinner className=" animate-spin " />
                        </div>
                      ) : (
                        "Log in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="image-login">
            <img
              src={assets.loginImage}
              alt="Sagar's Photo"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
