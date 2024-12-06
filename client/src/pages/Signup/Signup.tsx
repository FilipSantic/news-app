import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import styles from "./SignUp.module.scss";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  interface SignupValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const initialValues: SignupValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(50, "First name must be 50 characters or less")
      .required("First name is required"),
    lastName: Yup.string()
      .max(50, "Last name must be 50 characters or less")
      .required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  const onSubmit = (
    values: SignupValues,
    { setSubmitting }: FormikHelpers<SignupValues>
  ) => {
    axios
      .post("/api/auth/signup", values)
      .then((response) => {
        alert(
          "Signup successful! Please check your email to verify your account."
        );
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert("Error creating account. Please try again.");
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
      <div className={styles.signupContainer}>
        <h2>Sign Up</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.signupForm}>
              <label htmlFor="firstName">First Name</label>
              <Field
                name="firstName"
                type="text"
                className={styles.inputField}
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className={styles.error}
              />

              <label htmlFor="lastName">Last Name</label>
              <Field
                name="lastName"
                type="text"
                className={styles.inputField}
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className={styles.error}
              />

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

              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                name="confirmPassword"
                type="password"
                className={styles.inputField}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={styles.error}
              />

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className={styles.signinPrompt}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
