import { Server as socketIo } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookie from "cookie";

let io;

// Initialize Socket.io
const initializeSocket = (server) => {
  io = new socketIo(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "your-frontend-domain.com"
          : "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    let token;
    if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.token;
    }
    if (!token) return next(new Error("No token in cookies"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Join post room for live commenting
    socket.on("join-post", (postId) => {
      socket.join(`post-${postId}`);
      console.log(`${socket.user.username} joined post-${postId}`);

      // Notify others in the room
      socket.to(`post-${postId}`).emit("user-joined", {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
      });
    });

    // Leave post room
    socket.on("leave-post", (postId) => {
      socket.leave(`post-${postId}`);
      console.log(`${socket.user.username} left post-${postId}`);

      // Notify others in the room
      socket.to(`post-${postId}`).emit("user-left", {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
        },
      });
    });

    // Handle typing indicator
    socket.on("typing-start", (data) => {
      socket.to(`post-${data.postId}`).emit("user-typing", {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
        },
        postId: data.postId,
      });
    });

    socket.on("typing-stop", (data) => {
      socket.to(`post-${data.postId}`).emit("user-stop-typing", {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        postId: data.postId,
      });
    });

    // Handle real-time reactions/likes
    socket.on("post-like", (data) => {
      socket.to(`post-${data.postId}`).emit("post-liked", {
        postId: data.postId,
        userId: socket.user._id,
        username: socket.user.username,
        liked: data.liked,
        likesCount: data.likesCount,
      });
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log(`User ${socket.user.username} disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get Socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Emit new comment to post room
const emitNewComment = (postId, comment) => {
  if (io) {
    io.to(`post-${postId}`).emit("new-comment", comment);
  }
};

// Emit comment update to post room
const emitCommentUpdate = (postId, comment) => {
  if (io) {
    io.to(`post-${postId}`).emit("comment-updated", comment);
  }
};

// Emit comment deletion to post room
const emitCommentDelete = (postId, commentId) => {
  if (io) {
    io.to(`post-${postId}`).emit("comment-deleted", { commentId });
  }
};

// Emit comment like to post room
const emitCommentLike = (postId, commentId, userId, liked, likesCount) => {
  if (io) {
    io.to(`post-${postId}`).emit("comment-liked", {
      commentId,
      userId,
      liked,
      likesCount,
    });
  }
};

export  {
  initializeSocket,
  getIO,
  emitNewComment,
  emitCommentUpdate,
  emitCommentDelete,
  emitCommentLike,
};
