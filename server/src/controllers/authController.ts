import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import transporter from "../config/mail";

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Sign-up Verification",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });

    res
      .status(201)
      .json({ message: "User created. Please verify your email." });
  } catch (error: any) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.isVerified) {
      res
        .status(400)
        .json({ message: "Please verify your email before signing in" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.TOKEN_EXPIRATION as string,
    });

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    };

    res.status(200).json({ message: "Sign-in successful", userData });
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Invalid verification token" });
      return;
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(400).json({ message: "Invalid verification token" });
      return;
    }

    if (
      user.verificationTokenExpires &&
      user.verificationTokenExpires < new Date()
    ) {
      res.status(400).json({ message: "Verification token has expired" });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User with specified email not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "News App Sign-up Verification",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });

    res.status(200).json({ message: "Verification email resent" });
  } catch (error: any) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
};
