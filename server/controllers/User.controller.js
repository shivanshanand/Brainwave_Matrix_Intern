import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
      msg: "Registered successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: "Error registering user", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
      message: "LoggedIn successfully!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

// logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

// Get Current User (protected, returns public user info)
export const getCurrentUser = async (req, res) => {
  try {
    // req.user.id is set by your auth middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user", error: err.message });
  }
};
