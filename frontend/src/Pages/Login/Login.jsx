import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authWrapper from "../../utils/AuthWrapper";

import frame1 from "../../Assets/assets/img/frame1.png";
import frame2 from "../../Assets/assets/img/frame2.png";
import frame3 from "../../Assets/assets/img/frame3.png";
import talws from "../../Assets/assets/img/talws-removebg-preview 1.png";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Hook to handle navigation

    const handleLogin = async (event) => {
        event.preventDefault();
        const data = { email, password };
        setErrors({}); // Reset errors on new submission

        try {
            const response = await authWrapper('/auth/login', data, true);

            // Storing the entire login response in session storage
            sessionStorage.setItem('auth', JSON.stringify(response.data));
            sessionStorage.setItem('token', response.data.data.token)
            console.log("Login successful", response.data);
            console.log("Login successf123456ul", response.data.data.token);

            navigate('/users'); // Redirect to the user dashboard

        } catch (err) {
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors);
                toast.error(err.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error("Login error:", err);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />
            <div className="page-sign">
                <div className="container justify-content-center">
                    <div className="row gx-0">
                        <div className="col-8 col-lg-6 mb-5 mb-lg-0">
                            <div className="card card-one card-sign bg-blue ml-auto">
                                <div className="card-body">
                                    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active" data-bs-interval="10000">
                                                <img src={frame1} className="d-block w-90 p-20 pt-5" alt="First slide" />
                                            </div>
                                            <div className="carousel-item" data-bs-interval="2000">
                                                <img src={frame2} className="d-block w-90 p-20 pt-5" alt="Second slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img src={frame3} className="d-block w-90 p-20 pt-5" alt="Third slide" />
                                            </div>
                                        </div>
                                        <div className="carousel-indicators mb-0">
                                            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 d-flex flex-column align-items-center">
                            <div className="card card-one radius-form card-sign mr-auto">
                                <div className="card-header text-center d-block pt-0">
                                    <img className="text-center" src={talws} width="200px" alt="Logo" />
                                    <a href="../" className="header-logo mb-4">Hello Admin!</a>
                                    <p className="card-text">Please enter your email to login into your account.</p>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleLogin} className="needs-validation" noValidate autoComplete='on'>
                                        <div className="mb-4">
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-sign">Login</button>
                                    </form>
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex justify-content-space-between">
                                        <small>All rights reserved</small>
                                        <small>Terms of use | Privacy Policy</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
