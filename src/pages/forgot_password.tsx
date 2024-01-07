import "./forgot_password.css";
import studentImg from "../../src/assets/images/forgot-pass-student-img.png";
import submitIcon from "../../src/assets/images/icons/arrow.png";
import backIcon from "../../src/assets/images/icons/back-2.png";
import uniteeLogo from "../../src/assets/images/unitee.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import LoadingScreen from "./common/LoadingScreen";
import axios from "axios";

type ValidationErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

function Forgot_Password() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // * Get the token from the URI
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    
    if (!token) {
      navigate("/");
    } else {
      axios.get(`https://localhost:7017/Users/validate-reset-token?token=${token}`)
        .then(response => {
          if(response.data.isValid) {
            localStorage.setItem("token", token);
            setResetToken(token);
          } else {
            navigate("/");
          }
        })
        .catch(error => {
          console.error('Error validating token:', error);
          navigate("/");
        });
    }
  }, [location, navigate]);

  // * Reset Password
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsLoading(true); 

      try {
        const response = await fetch("https://localhost:7017/Users/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Token: resetToken,
              NewPassword: newPassword,
            }),
          }
        );

        if (response.ok) {
          localStorage.removeItem('token');
          toast.success("Successfully updated the password");
          await sleep(10000);
          navigate("/");
          localStorage.removeItem(resetToken);
        } else {
          toast.error("Failed to update the password");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    }
  };

  // * Validate Form
  const validateForm = () => {
    const errors: ValidationErrors = {};

    if (!newPassword) {
      errors.newPassword = "Password is required.";
      toast.error(errors.newPassword);
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long.";
      toast.error(errors.newPassword);
    } else if (/^[a-zA-Z0-9]*$/.test(newPassword)) {
      errors.newPassword = "Password must be alpha numeric.";
      toast.error(errors.newPassword);
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords did not match.";
      toast.error(errors.confirmPassword);
    }

    return errors;
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <React.Fragment>
          <LoadingScreen />
        </React.Fragment>
      ) : (
        <div className="forgot-pwd-main-container">
          <div className="forgot-pwd-subContainer">
            <div className="col-md-12 logo-container-forgotPage">
              <img className="webLogo" src={uniteeLogo} />
            </div>
            <div className="col-md-12 instruction-container">
              <h1 className="instruction-title">Don't Worry</h1>
              <span className="forgot-pwd-instruction">
                We are here to help you to recover your password.
              </span>
              <span>
                Enter the ID Number and Email address you used when you
                registered.
              </span>
            </div>
            <div className="forgot-pwd-form">
              {/* NEW PASSWORD */}
              <label htmlFor="forgot-password">New Password</label>
              <input
                className="forgot-form-input"
                placeholder="Enter your new password"
                type="password"
                name="forgot-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* CONFIRM PASSWORD */}
              <label htmlFor="forgot-password">Confirm Password</label>
              <input
                className="forgot-form-input"
                placeholder="Enter your confirm password"
                type="password"
                name="forgot-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="col-md-7 forgot-form-btn-container">
              <Link className="forgot-to-login" to="/">
                <button className="forgot-form-cancel-btn">
                  <img className="forgot-btn-icons" src={backIcon} />
                  Back
                </button>
              </Link>
              <button className="forgot-form-submit-btn" onClick={handleSubmit}>
                <img className="forgot-btn-icon-submit" src={submitIcon} />
                Submit
              </button>
            </div>
          </div>
          <img className="studentImg" src={studentImg} />
        </div>
      )}
    </React.Fragment>
  );
}

export default Forgot_Password;