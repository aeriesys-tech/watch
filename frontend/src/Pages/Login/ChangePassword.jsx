import React, { useState, useRef, useEffect } from "react";
import authWrapper from "../../utils/AuthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

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

    useEffect(() => {
        // Extract the email from the URL query parameters
        const params = new URLSearchParams(location.search);
        const emailParam = params.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const data = { email, otp, newPassword, confirmPassword };

        try {
            const response = await authWrapper('/auth/resetPassword', data);
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
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
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
                            <img src="../assets/img/Bespoke_logo_svg 1.png" className="img" width="80" />
                        </div>
                        <h4 className="card-title1 text-dark mb-0">Reset your password</h4>
                        <p className="card-text text-center">Enter the OTP and reset your password here.</p>
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
                                {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                            </div>
                            <div className="row mb-2">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </div>
                            <div className="text-center">
                                <a href="Login.html">Sign In</a>
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
