import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import styles from "./SignIn.module.scss";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  interface LoginValues {
    email: string;
    password: string;
  }

  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    axios
      .post("/api/auth/signin", values)
      .then((response) => {
        const userData = response.data.userData;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Invalid email or password.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Header />
      </div>
      <div className={styles.loginContainer}>
        <h2>Sign In</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.loginForm}>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className={styles.inputField} />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />

              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
                className={styles.inputField}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <p className={styles.signupPrompt}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
