const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const rateRoutes = require("./routes/rateRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const issueRoutes = require("./routes/issueRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const featureSuggestionRoutes = require("./routes/featureSuggestionRoutes");
const docImprovementRoutes = require("./routes/docImprovementRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const contentReportRoutes = require("./routes/contentReportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io accessible globally
global.io = io;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("DevVault API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/resources", rateRoutes);
app.use("/api/bookmark", bookmarkRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/feature-suggestions", featureSuggestionRoutes);
app.use("/api/doc-improvements", docImprovementRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/content-reports", contentReportRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room for notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Leave user room
  socket.on('leave', (userId) => {
    socket.leave(userId);
    console.log(`User ${userId} left room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5300;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
