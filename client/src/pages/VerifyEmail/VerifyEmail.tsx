import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyEmail.module.scss";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      axios
        .get(`/api/auth/verify-email?token=${token}`)
        .then((response) => {
          setStatus("Email verified successfully!");
          setIsLoading(false);
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
        })
        .catch((error) => {
          setStatus("Verification failed. The link may be invalid or expired.");
          setIsLoading(false);
          console.error("Email verification error:", error);
        });
    } else {
      setStatus("No verification token provided.");
      setIsLoading(false);
    }
  }, [location, navigate]);

  return (
    <div className={styles.verifyEmailContainer}>
      <div>
        <h2>{status}</h2>
        {isLoading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
};

export default VerifyEmail;
