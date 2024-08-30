import React, { useState, useRef, useEffect } from "react";
import authWrapper from "../../utils/AuthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import talws from "../../Assets/assets/img/talws-removebg-preview 1.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleForgetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authWrapper("/auth/forgotPassword", { email });

      if (response) {
        toast.success(
          "A link to reset your password has been sent to your email."
        );
        setTimeout(() => {
          navigate(`/change-password?email=${encodeURIComponent(email)}`);
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
      <div className="page-auth">
        <div className="content">
          <div className="container">
            <div className="card card-auth">
              <div className="card-body text-center">
                <div className="mb-3">
                  <img
                    className="text-center"
                    src={talws}
                    width="200px"
                    alt="Logo"
                  />
                </div>
                <h4 className="card-title1 text-dark">Forgot your password</h4>
                <p className="card-text mb-4">
                  Enter your username or email address and we will send you a
                  link to reset your password.
                </p>

                <form onSubmit={handleForgetPassword}>
                  <div className="row g-2">
                    <div className="col-sm-8">
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    <div className="col-sm-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Reset"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={4000} position="top-right" />
    </>
  );
}

export default ForgotPassword;
