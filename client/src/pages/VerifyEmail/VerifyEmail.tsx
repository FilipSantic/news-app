import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.module.scss";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      axios
        .get(`/api/auth/verify-email?token=${token}`)
        .then((response) => {
          setStatus("Email verified successfully!");
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
        })
        .catch((error) => {
          setStatus("Verification failed. The link may be invalid or expired.");
          console.error("Email verification error:", error);
        });
    } else {
      setStatus("No verification token provided.");
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
