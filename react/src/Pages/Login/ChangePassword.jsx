import React, { useState, useRef, useEffect } from "react";
import authWrapper from "../../utils/AuthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import talws from "../../Assets/assets/img/talws-removebg-preview 1.png";
function ChangePassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const otpRef = useRef(null);
  const [intervalTimeout, setIntervalTimeout] = useState(30);
  const [resendOtp, setResendOtp] = useState(false);

  useEffect(() => {
    // Extract the email from the URL query parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const timeoutReset = () => {
    let seconds_id = setInterval(() => {
      setIntervalTimeout(prevTime => {
        if (prevTime <= 1) {
          setResendOtp(true);
          clearInterval(seconds_id);
          return 0; // Stop the countdown at 0
        } else {
          setResendOtp(false);
          return prevTime - 1; // Decrement the time
        }
      });
    }, 1000);
  
    // Clean up the interval on component unmount
    return () => clearInterval(seconds_id);
  }
  

  useEffect(() => {
    timeoutReset();
  }, []);


  const resendOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authWrapper("/auth/forgotPassword", { email });

      if (response) {
        toast.success(
          "A link to reset your password has been sent to your email."
        );
        setIntervalTimeout(30)
        timeoutReset()
        // setTimeout(() => {
        //   navigate(`/change-password?email=${encodeURIComponent(email)}`);
        // }, 1000);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const data = { email, otp, newPassword, confirmPassword };

    try {
      const response = await authWrapper("/auth/resetPassword", data);
      if (response) {
        toast.success("Password has been reset successfully.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-sign">
        <div className="card card-sign">
          <div className="card-header d-flex flex-column align-items-center">
            <div className="mb-2">
              <img
                className="text-center"
                src={talws}
                width="200px"
                alt="Logo"
              />
            </div>
            <h4 className="card-title1 text-dark mb-0">Reset your password</h4>
            <p className="card-text text-center">
              Enter the OTP and reset your password here.
            </p>
          </div>
          <div className="card-body pt-2">
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  ref={otpRef}
                />
                {errors.otp && (
                  <div className="invalid-feedback">{errors.otp}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && (
                  <div className="invalid-feedback">{errors.newPassword}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
              {resendOtp === false && <p className="card-text text-center">RESEND OTP (0:{intervalTimeout})</p> }
              {resendOtp && <p className="card-text text-center" > <a href="#" onClick={resendOTP} >RESEND OTP</a></p> }
              
              <div className="text-center">
                <Link to="/auth/login">Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={4000} position="top-right" />
    </>
  );
}

export default ChangePassword;
