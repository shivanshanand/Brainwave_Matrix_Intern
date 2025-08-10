import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ msg: "No token, auth denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};

export default auth;
