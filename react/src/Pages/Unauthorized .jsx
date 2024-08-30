// src/Pages/Unauthorized.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css"; // Import the CSS file

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate to the previous route
  };
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-window">
          <div className="unauthorized-header">
            <div className="unauthorized-dot"></div>
            <div className="unauthorized-dot"></div>
            <div className="unauthorized-dot"></div>
          </div>
          <div className="unauthorized-body">
            <h1 className="unauthorized-title">403</h1>
            <p className="unauthorized-message">Forbidden</p>
          </div>
        </div>
        <button className="unauthorized-button" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
